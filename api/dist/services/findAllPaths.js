"use strict";
// import { AdjacencyList } from "./buildAdjacencyList";
// import { RoutePath } from "../types/routesData";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Finds all possible routes from 'from' to 'to', selecting one provider per leg.
 * Allows mixing and matching providers from different companies.
 * Calculates the total price for each route.
 *
 * @param adjacency - The adjacency list representing the graph with provider options.
 * @param from - The starting planet name.
 * @param to - The destination planet name.
 * @returns An array of RouteOption objects representing all possible routes.
 */
const findAllPaths = (adjacency, from, to) => {
    const allRoutes = [];
    /**
     * Recursive helper function to perform DFS traversal.
     *
     * @param current - The current planet.
     * @param visited - A set of visited planets to avoid cycles.
     * @param flights - The list of selected ProviderLegs for the current path.
     * @param totalPrice - The accumulated price for the current path.
     */
    const dfs = (current, visited, flights, totalPrice, totalDistance, firstFlightStartTime, lastFlightEndTime) => {
        // Base case: Destination reached
        if (current === to) {
            if (flights.length > 0 && firstFlightStartTime && lastFlightEndTime) {
                const totalDurationMs = lastFlightEndTime.getTime() - firstFlightStartTime.getTime();
                const totalDurationMinutes = Math.floor(totalDurationMs / (1000 * 60));
                allRoutes.push({
                    flights: [...flights],
                    totalPrice,
                    totalDistance,
                    totalTravelTime: totalDurationMinutes,
                });
            }
            return;
        }
        // Get all possible flight options from the current planet
        const neighbors = adjacency[current] || [];
        for (const edge of neighbors) {
            const nextPlanet = edge.to;
            // Avoid cycles by checking if the planet has already been visited
            if (!visited.has(nextPlanet)) {
                // Mark the planet as visited
                const flightStart = new Date(edge.flightStart);
                const flightEnd = new Date(edge.flightEnd);
                if (lastFlightEndTime && flightStart < lastFlightEndTime) {
                    continue;
                }
                visited.add(nextPlanet);
                // Select the current provider for this leg
                const selectedFlight = {
                    from: current,
                    to: nextPlanet,
                    distance: edge.distance,
                    companyId: edge.companyId,
                    company: {
                        name: edge.companyName,
                    },
                    price: edge.price,
                    flightStart: edge.flightStart,
                    flightEnd: edge.flightEnd,
                    validUntil: edge.validUntil,
                };
                // Add the selected flight to the current path
                flights.push(selectedFlight);
                totalPrice += edge.price;
                totalDistance += edge.distance;
                const updatedFirstStartTime = firstFlightStartTime || flightStart;
                const updatedLastEndTime = flightEnd;
                // Recurse to the next planet
                dfs(nextPlanet, visited, flights, totalPrice, totalDistance, updatedFirstStartTime, updatedLastEndTime);
                // Backtrack: Remove the current planet and flight from the path
                visited.delete(nextPlanet);
                flights.pop();
                totalPrice -= edge.price;
                totalDistance -= edge.distance;
            }
        }
    };
    // Initialize DFS traversal
    const visited = new Set();
    visited.add(from);
    dfs(from, visited, [], 0, 0, null, null);
    return allRoutes;
};
exports.default = findAllPaths;
//# sourceMappingURL=findAllPaths.js.map