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
Object.defineProperty(exports, "__esModule", { value: true });
const loadAllLegs = (filter, validUntil) => __awaiter(void 0, void 0, void 0, function* () {
    const providerLegs = [];
    // if (filter === "all") {
    //   providerLegs = await prisma.providerLeg.findMany({
    //     where: {
    //       validUntil: validUntil,
    //     },
    //     include: {
    //       company: true,
    //     },
    //   });
    // } else {
    //   providerLegs = await prisma.providerLeg.findMany({
    //     where: {
    //       validUntil: validUntil,
    //       company: {
    //         name: filter,
    //       },
    //     },
    //     include: {
    //       company: true,
    //     },
    //   });
    // }
    return providerLegs.map((providerLeg) => ({
        apiId: providerLeg.apiId,
        from: providerLeg.from,
        to: providerLeg.to,
        distance: providerLeg.distance,
        companyName: providerLeg.companyName,
        price: providerLeg.price,
        flightStart: providerLeg.flightStart,
        flightEnd: providerLeg.flightEnd,
        validUntil: providerLeg.validUntil,
    }));
});
exports.default = loadAllLegs;
//# sourceMappingURL=getAllLegs.js.map