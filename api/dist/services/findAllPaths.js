"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findAllPaths = (adjacency, from, to) => {
    const allRoutes = [];
    const dfs = (current, visited, flights, totalPrice, totalDistance, firstFlightStartTime, lastFlightEndTime) => {
        if (current === to) {
            if (flights.length > 0 && firstFlightStartTime && lastFlightEndTime) {
                const totalDurationMs = lastFlightEndTime.getTime() - firstFlightStartTime.getTime();
                const totalDurationMinutes = Math.floor(totalDurationMs / (1000 * 60));
                allRoutes.push({
                    flights: [...flights],
                    totalPrice,
                    totalDistance,
                    totalTravelTime: totalDurationMinutes,
                    validUntil: flights[0].validUntil,
                });
            }
            return;
        }
        const neighbors = adjacency[current] || [];
        for (const edge of neighbors) {
            const nextPlanet = edge.to;
            if (!visited.has(nextPlanet)) {
                const flightStart = new Date(edge.flightStart);
                const flightEnd = new Date(edge.flightEnd);
                if (lastFlightEndTime && flightStart < lastFlightEndTime) {
                    continue;
                }
                visited.add(nextPlanet);
                const selectedFlight = {
                    apiId: edge.apiId,
                    from: current,
                    to: nextPlanet,
                    distance: edge.distance,
                    companyName: edge.companyName,
                    price: edge.price,
                    flightStart: edge.flightStart,
                    flightEnd: edge.flightEnd,
                    validUntil: edge.validUntil,
                };
                flights.push(selectedFlight);
                totalPrice += edge.price;
                totalDistance += edge.distance;
                const updatedFirstStartTime = firstFlightStartTime || flightStart;
                const updatedLastEndTime = flightEnd;
                dfs(nextPlanet, visited, flights, totalPrice, totalDistance, updatedFirstStartTime, updatedLastEndTime);
                visited.delete(nextPlanet);
                flights.pop();
                totalPrice -= edge.price;
                totalDistance -= edge.distance;
            }
        }
    };
    const visited = new Set();
    visited.add(from);
    dfs(from, visited, [], 0, 0, null, null);
    return allRoutes;
};
exports.default = findAllPaths;
//# sourceMappingURL=findAllPaths.js.map