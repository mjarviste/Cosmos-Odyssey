"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildAdjacencyList = (providerLegs) => {
    const adjacency = {};
    providerLegs.forEach((providerLeg) => {
        const fromName = providerLeg.from;
        const toName = providerLeg.to;
        const distance = providerLeg.distance;
        const companyId = providerLeg.companyId;
        const companyName = providerLeg.company.name;
        const price = providerLeg.price;
        const flightStart = providerLeg.flightStart;
        const flightEnd = providerLeg.flightEnd;
        const validUntil = providerLeg.validUntil;
        if (!adjacency[fromName])
            adjacency[fromName] = [];
        adjacency[fromName].push({
            to: toName,
            distance,
            companyId,
            companyName,
            price,
            flightStart,
            flightEnd,
            validUntil,
        });
    });
    return adjacency;
};
exports.default = buildAdjacencyList;
//# sourceMappingURL=buildAdjacencyList.js.map