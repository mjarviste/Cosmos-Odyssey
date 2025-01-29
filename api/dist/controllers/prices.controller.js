"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriceList = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const axios_1 = __importDefault(require("axios"));
const getAllLegs_1 = __importDefault(require("../services/getAllLegs"));
const buildAdjacencyList_1 = __importDefault(require("../services/buildAdjacencyList"));
const findAllPaths_1 = __importDefault(require("../services/findAllPaths"));
const getLatestValidUntil = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validUntil = yield prisma_1.default.validUntil.findFirst({
            orderBy: {
                validUntil: "desc",
            },
        });
        return validUntil;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
const deleteOldestData = () => __awaiter(void 0, void 0, void 0, function* () {
    const allValidUntils = yield prisma_1.default.validUntil.findMany();
    if (allValidUntils.length > 15) {
        prisma_1.default.validUntil.deleteMany({
            where: {
                validUntil: allValidUntils[allValidUntils.length - 1].validUntil,
            },
        });
        prisma_1.default.routesData.deleteMany({
            where: {
                validUntil: allValidUntils[allValidUntils.length - 1].validUntil,
            },
        });
        prisma_1.default.providerLeg.deleteMany({
            where: {
                validUntil: allValidUntils[allValidUntils.length - 1].validUntil,
            },
        });
    }
});
const fetchPriceList = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default.get(process.env.COSMOS_ODYSSEY_API_URL || "");
    const routesData = {
        apiId: data.id,
        validUntil: new Date(data.validUntil),
        legs: data.legs.map((leg) => {
            const fromPlanet = {
                apiId: leg.routeInfo.from.id,
                name: leg.routeInfo.from.name,
            };
            const toPlanet = {
                apiId: leg.routeInfo.to.id,
                name: leg.routeInfo.to.name,
            };
            const routeInfo = {
                apiId: leg.routeInfo.id,
                distance: leg.routeInfo.distance,
                from: fromPlanet,
                to: toPlanet,
            };
            const providers = leg.providers.map((provider) => {
                const apiId = provider.id;
                const price = provider.price;
                const flightStart = new Date(provider.flightStart);
                const flightEnd = new Date(provider.flightEnd);
                const company = {
                    apiId: provider.company.id,
                    name: provider.company.name,
                };
                return { apiId, price, flightStart, flightEnd, company };
            });
            return {
                apiId: leg.id,
                routeInfo,
                providers,
            };
        }),
    };
    return routesData;
});
const storeData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.routesData.create({
        data: {
            apiId: data.apiId,
            validUntil: data.validUntil,
            legs: {
                create: data.legs.map((leg) => ({
                    apiId: leg.apiId,
                    routeInfo: {
                        connectOrCreate: {
                            where: { apiId: leg.routeInfo.apiId },
                            create: {
                                apiId: leg.routeInfo.apiId,
                                distance: leg.routeInfo.distance,
                                from: {
                                    connectOrCreate: {
                                        where: { apiId: leg.routeInfo.from.apiId },
                                        create: {
                                            apiId: leg.routeInfo.from.apiId,
                                            name: leg.routeInfo.from.name,
                                        },
                                    },
                                },
                                to: {
                                    connectOrCreate: {
                                        where: { apiId: leg.routeInfo.to.apiId },
                                        create: {
                                            apiId: leg.routeInfo.to.apiId,
                                            name: leg.routeInfo.to.name,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    providers: {
                        create: leg.providers.map((provider) => ({
                            apiId: provider.apiId,
                            flightStart: provider.flightStart,
                            flightEnd: provider.flightEnd,
                            price: provider.price,
                            company: {
                                connectOrCreate: {
                                    where: { apiId: provider.company.apiId },
                                    create: {
                                        apiId: provider.company.apiId,
                                        name: provider.company.name,
                                    },
                                },
                            },
                        })),
                    },
                })),
            },
        },
        include: {
            legs: {
                include: {
                    routeInfo: {
                        include: { from: true, to: true },
                    },
                    providers: {
                        include: { company: true },
                    },
                },
            },
        },
    });
    yield prisma_1.default.validUntil.create({
        data: {
            validUntil: data.validUntil,
        },
    });
    const providerLegPromises = data.legs.flatMap((leg) => leg.providers.map((provider) => prisma_1.default.providerLeg.create({
        data: {
            from: leg.routeInfo.from.name,
            to: leg.routeInfo.to.name,
            distance: leg.routeInfo.distance,
            companyName: provider.company.name,
            company: { connect: { apiId: provider.company.apiId } },
            price: provider.price,
            flightStart: provider.flightStart,
            flightEnd: provider.flightEnd,
            validUntil: data.validUntil,
        },
    })));
    yield Promise.all(providerLegPromises);
});
const getPriceList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, filter } = req.query;
    const fromString = String(from);
    const toString = String(to);
    const companyFilter = String(filter);
    try {
        let latestValidUntil = yield getLatestValidUntil();
        console.log("latestValidUntil: ", latestValidUntil === null || latestValidUntil === void 0 ? void 0 : latestValidUntil.validUntil);
        console.log("new Date(): ", new Date());
        if (latestValidUntil && latestValidUntil.validUntil > new Date()) {
            const providerLegs = yield (0, getAllLegs_1.default)(companyFilter, latestValidUntil.validUntil);
            const adjacencyList = (0, buildAdjacencyList_1.default)(providerLegs);
            const allPaths = (0, findAllPaths_1.default)(adjacencyList, fromString, toString);
            res.json(allPaths);
        }
        else {
            const routesData = yield fetchPriceList();
            yield storeData(routesData);
            // await deleteOldestData();
            latestValidUntil = yield getLatestValidUntil();
            const providerLegs = yield (0, getAllLegs_1.default)(companyFilter, latestValidUntil.validUntil);
            const adjacencyList = (0, buildAdjacencyList_1.default)(providerLegs);
            const allPaths = (0, findAllPaths_1.default)(adjacencyList, fromString, toString);
            res.json(allPaths);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch price list" });
    }
});
exports.getPriceList = getPriceList;
//# sourceMappingURL=prices.controller.js.map