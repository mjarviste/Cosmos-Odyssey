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
const prisma_1 = __importDefault(require("../lib/prisma"));
const loadAllLegs = () => __awaiter(void 0, void 0, void 0, function* () {
    const legs = yield prisma_1.default.leg.findMany({
        include: {
            routeInfo: {
                include: { from: true, to: true },
            },
            providers: {
                include: {
                    company: true,
                },
            },
        },
    });
    return legs.map((leg) => ({
        apiId: leg.apiId,
        routeInfo: {
            apiId: leg.routeInfo.apiId,
            distance: leg.routeInfo.distance,
            from: {
                apiId: leg.routeInfo.from.apiId,
                name: leg.routeInfo.from.name,
            },
            to: {
                apiId: leg.routeInfo.to.apiId,
                name: leg.routeInfo.to.name,
            },
        },
        providers: leg.providers.map((provider) => ({
            apiId: provider.apiId,
            price: provider.price,
            flightStart: provider.flightStart,
            flightEnd: provider.flightEnd,
            company: {
                apiId: provider.company.apiId,
                name: provider.company.name,
            },
        })),
    }));
});
exports.default = loadAllLegs;
//# sourceMappingURL=getAllLegs.js.map