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
exports.getPriceList = exports.getPlanetNames = exports.getCompanyNames = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const buildAdjacencyList_1 = __importDefault(require("../services/buildAdjacencyList"));
const findAllPaths_1 = __importDefault(require("../services/findAllPaths"));
const clearArray = (array) => {
    while (array.length > 0) {
        array.pop();
    }
};
const fetchPriceList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(process.env.COSMOS_ODYSSEY_API_URL || "");
        return data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
let routesData = null;
const setRoutesData = (data) => {
    routesData = data;
};
const getRoutesData = () => {
    return routesData;
};
const providerLegs = [];
const getManyProviderLegs = (filter) => {
    if (filter !== "all") {
        const filteredProviderLegs = providerLegs.filter((providerLeg) => providerLeg.companyName === filter);
        return filteredProviderLegs;
    }
    return providerLegs;
};
const getCompanyNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchPriceList();
        const companyNames = data.legs.reduce((names, leg) => {
            leg.providers.forEach((provider) => {
                if (!names.includes(provider.company.name)) {
                    names.push(provider.company.name);
                }
            });
            return names;
        }, []);
        res.status(201).json(companyNames);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch company names" });
    }
});
exports.getCompanyNames = getCompanyNames;
const getPlanetNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchPriceList();
        const planetNames = data.legs.reduce((names, leg) => {
            if (!names.includes(leg.routeInfo.from.name)) {
                names.push(leg.routeInfo.from.name);
            }
            if (!names.includes(leg.routeInfo.to.name)) {
                names.push(leg.routeInfo.to.name);
            }
            return names;
        }, []);
        res.status(201).json(planetNames);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch planet names" });
    }
});
exports.getPlanetNames = getPlanetNames;
const createProviderLegs = (data) => {
    clearArray(providerLegs);
    data.legs.forEach((leg) => {
        leg.providers.forEach((provider) => {
            providerLegs.push({
                apiId: (0, uuid_1.v4)(),
                from: leg.routeInfo.from.name,
                to: leg.routeInfo.to.name,
                distance: leg.routeInfo.distance,
                companyName: provider.company.name,
                price: provider.price,
                flightStart: provider.flightStart,
                flightEnd: provider.flightEnd,
                validUntil: data.validUntil,
            });
        });
    });
};
const storeData = (validUntil, data) => __awaiter(void 0, void 0, void 0, function* () {
    const storedValidUntil = yield prisma_1.default.validUntil.create({
        data: {
            validUntil: validUntil,
        },
    });
    const storedRoutesData = yield prisma_1.default.routesData.create({
        data: {
            apiId: data.id,
            validUntil: new Date(data.validUntil),
            legs: {
                create: data.legs.map((leg) => ({
                    apiId: leg.id,
                    routeInfo: {
                        create: {
                            apiId: leg.routeInfo.id,
                            distance: leg.routeInfo.distance,
                            from: {
                                connectOrCreate: {
                                    where: { apiId: leg.routeInfo.from.id },
                                    create: {
                                        apiId: leg.routeInfo.from.id,
                                        name: leg.routeInfo.from.name,
                                    },
                                },
                            },
                            to: {
                                connectOrCreate: {
                                    where: { apiId: leg.routeInfo.to.id },
                                    create: {
                                        apiId: leg.routeInfo.to.id,
                                        name: leg.routeInfo.to.name,
                                    },
                                },
                            },
                        },
                    },
                    providers: {
                        create: leg.providers.map((provider) => ({
                            apiId: provider.id,
                            price: provider.price,
                            flightStart: new Date(provider.flightStart),
                            flightEnd: new Date(provider.flightEnd),
                            company: {
                                connectOrCreate: {
                                    where: { apiId: provider.company.id },
                                    create: {
                                        apiId: provider.company.id,
                                        name: provider.company.name,
                                    },
                                },
                            },
                        })),
                    },
                })),
            },
        },
    });
    try {
        yield Promise.all([storedValidUntil, storedRoutesData]);
    }
    catch (error) {
        console.error(error);
    }
});
const findLatestValidUntil = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestValidUntil = yield prisma_1.default.validUntil.findFirst({
            orderBy: {
                validUntil: "desc",
            },
        });
        return latestValidUntil;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
const findAvailableRoutes = (companyFilter, fromString, toString) => {
    const currentProviderLegs = getManyProviderLegs(companyFilter);
    const adjacencyList = (0, buildAdjacencyList_1.default)(currentProviderLegs);
    const allPaths = (0, findAllPaths_1.default)(adjacencyList, fromString, toString);
    return allPaths;
};
const deleteRoutesData = (routesDataId) => __awaiter(void 0, void 0, void 0, function* () {
    const legs = yield prisma_1.default.leg.findMany({
        where: { routesDataId },
        select: { id: true, routeInfoId: true },
    });
    const legIds = legs.map((leg) => leg.id);
    const routeInfoIds = legs
        .map((leg) => leg.routeInfoId)
        .filter((id) => !!id);
    yield prisma_1.default.leg.deleteMany({
        where: { routesDataId },
    });
    yield prisma_1.default.provider.deleteMany({
        where: {
            legId: { in: legIds },
        },
    });
    yield prisma_1.default.routeInfo.deleteMany({
        where: {
            id: { in: routeInfoIds },
        },
    });
    yield prisma_1.default.routesData.delete({
        where: { id: routesDataId },
    });
});
const deleteReservations = (validUntil) => __awaiter(void 0, void 0, void 0, function* () {
    const reservations = yield prisma_1.default.reservation.findMany({
        where: { validUntil },
        select: { id: true },
    });
    if (reservations.length === 0)
        return { message: "No reservations found" };
    const reservationIds = reservations.map((reservation) => reservation.id);
    const pivotRecords = yield prisma_1.default.reservationProviderLeg.findMany({
        where: { reservationId: { in: reservationIds } },
        select: { providerLegId: true },
    });
    const providerLegIds = pivotRecords.map((record) => record.providerLegId);
    yield prisma_1.default.reservationProviderLeg.deleteMany({
        where: { reservationId: { in: reservationIds } },
    });
    yield prisma_1.default.reservation.deleteMany({
        where: { id: { in: reservationIds } },
    });
    const uniqueLegIds = [...new Set(providerLegIds)];
    const orphans = [];
    for (const legId of uniqueLegIds) {
        const stillUsedCount = yield prisma_1.default.reservationProviderLeg.count({
            where: { providerLegId: legId },
        });
        if (stillUsedCount === 0) {
            orphans.push(legId);
        }
    }
    if (orphans.length > 0) {
        yield prisma_1.default.providerLeg.deleteMany({
            where: { id: { in: orphans } },
        });
    }
    return {
        reservationsDeleted: reservationIds,
        pivotDeletedCount: pivotRecords.length,
        orphanedLegsDeleted: orphans.length,
    };
});
const deleteOldData = () => __awaiter(void 0, void 0, void 0, function* () {
    const allValidUntils = yield prisma_1.default.validUntil.findMany();
    if (allValidUntils.length > 15) {
        const propValidUntil = allValidUntils[0].validUntil;
        const expiredRoutesData = yield prisma_1.default.routesData.findFirst({
            where: {
                validUntil: propValidUntil,
            },
        });
        if (expiredRoutesData) {
            yield deleteRoutesData(expiredRoutesData.id);
        }
        yield deleteReservations(propValidUntil);
        yield prisma_1.default.validUntil.deleteMany({
            where: {
                validUntil: propValidUntil,
            },
        });
    }
});
const getPriceList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, filter } = req.query;
    const fromString = String(from);
    const toString = String(to);
    const companyFilter = String(filter);
    try {
        console.log("Routes data:", routesData);
        const latestValidUntil = yield findLatestValidUntil();
        if (!routesData) {
            setRoutesData(yield fetchPriceList());
            createProviderLegs(routesData);
            if (latestValidUntil &&
                latestValidUntil.validUntil !== routesData.validUntil) {
                try {
                    yield storeData(routesData.validUntil, routesData);
                    yield deleteOldData();
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        console.log("Routes data:", routesData);
        if (latestValidUntil && latestValidUntil.validUntil > new Date()) {
            console.log("Using old data");
            const allPaths = findAvailableRoutes(companyFilter, fromString, toString);
            res.json(allPaths);
        }
        else {
            console.log("Using new data");
            setRoutesData(yield fetchPriceList());
            routesData = getRoutesData();
            createProviderLegs(routesData);
            const allPaths = findAvailableRoutes(companyFilter, fromString, toString);
            res.json(allPaths);
            try {
                yield storeData(routesData.validUntil, routesData);
                yield deleteOldData();
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch price list" });
    }
});
exports.getPriceList = getPriceList;
//# sourceMappingURL=prices.controller.js.map