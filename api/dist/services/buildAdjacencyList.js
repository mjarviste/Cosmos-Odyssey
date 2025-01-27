"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildAdjacencyList = (legs) => {
    const adjacency = {};
    legs.forEach((leg) => {
        const fromName = leg.routeInfo.from.name;
        const toName = leg.routeInfo.to.name;
        const distance = leg.routeInfo.distance;
        const legApiId = leg.apiId;
        const providerInfos = leg.providers.map((provider) => ({
            providerApiId: provider.apiId,
            price: provider.price,
            flightStart: provider.flightStart,
            flightEnd: provider.flightEnd,
            companyName: provider.company.name,
        }));
        if (!adjacency[fromName])
            adjacency[fromName] = [];
        const addEdge = (from, to, distance, legApiId, providers) => {
            const existingEdge = adjacency[from].find((edge) => edge.to === to && edge.legApiId === legApiId);
            if (existingEdge) {
                existingEdge.providers.push(providers);
            }
            else {
                adjacency[from].push({
                    to,
                    distance,
                    legApiId,
                    providers: [providers],
                });
            }
        };
        providerInfos.forEach((provider) => {
            addEdge(fromName, toName, distance, legApiId, provider);
        });
    });
    return adjacency;
};
exports.default = buildAdjacencyList;
//# sourceMappingURL=buildAdjacencyList.js.map