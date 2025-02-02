"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildAdjacencyList = (providerLegs) => {
    const adjacency = {};
    providerLegs.forEach((providerLeg) => {
        const apiId = providerLeg.apiId;
        const from = providerLeg.from;
        const to = providerLeg.to;
        const distance = providerLeg.distance;
        const companyName = providerLeg.companyName;
        const price = providerLeg.price;
        const flightStart = providerLeg.flightStart;
        const flightEnd = providerLeg.flightEnd;
        const validUntil = providerLeg.validUntil;
        if (!adjacency[from])
            adjacency[from] = [];
        adjacency[from].push({
            apiId,
            to,
            distance,
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