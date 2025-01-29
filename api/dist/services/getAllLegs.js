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
const loadAllLegs = (filter, validUntil) => __awaiter(void 0, void 0, void 0, function* () {
    let providerLegs = [];
    if (filter === "all") {
        providerLegs = yield prisma_1.default.providerLeg.findMany({
            where: {
                validUntil: validUntil,
            },
            include: {
                company: true,
            },
        });
    }
    else {
        providerLegs = yield prisma_1.default.providerLeg.findMany({
            where: {
                validUntil: validUntil,
                companyName: filter,
            },
            include: {
                company: true,
            },
        });
    }
    return providerLegs.map((providerLeg) => ({
        from: providerLeg.from,
        to: providerLeg.to,
        distance: providerLeg.distance,
        companyId: providerLeg.companyId,
        company: {
            name: providerLeg.company.name,
        },
        price: providerLeg.price,
        flightStart: providerLeg.flightStart,
        flightEnd: providerLeg.flightEnd,
        validUntil: providerLeg.validUntil,
    }));
});
exports.default = loadAllLegs;
//# sourceMappingURL=getAllLegs.js.map