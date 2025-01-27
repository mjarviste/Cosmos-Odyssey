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
});
const getPriceList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const legs = yield (0, getAllLegs_1.default)();
        const adjacencyList = (0, buildAdjacencyList_1.default)(legs);
        const { from = "Neptune", to = "Earth", page = "1", limit = "10", } = req.query;
        const origin = String(from);
        const destination = String(to);
        const pageNumber = parseInt(String(page), 10);
        const limitNumber = parseInt(String(limit), 10);
        const allPaths = (0, findAllPaths_1.default)(adjacencyList, origin, destination);
        const sortedRoutes = allPaths.sort((a, b) => a.totalDistance - b.totalDistance);
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = startIndex + limitNumber;
        const paginatedRoutes = sortedRoutes.slice(startIndex, endIndex);
        res.json({
            page: pageNumber,
            limit: limitNumber,
            totalRoutes: sortedRoutes.length,
            routes: paginatedRoutes,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch price list" });
    }
});
exports.getPriceList = getPriceList;
//# sourceMappingURL=prices.controller.js.map