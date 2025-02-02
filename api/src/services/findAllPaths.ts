import { ProviderLeg, RouteOption } from "../types/routesData";
import { AdjacencyList } from "./buildAdjacencyList";

const findAllPaths = (
  adjacency: AdjacencyList,
  from: string,
  to: string
): RouteOption[] => {
  const allRoutes: RouteOption[] = [];

  const dfs = (
    current: string,
    visited: Set<string>,
    flights: ProviderLeg[],
    totalPrice: number,
    totalDistance: number,
    firstFlightStartTime: Date | null,
    lastFlightEndTime: Date | null
  ) => {
    if (current === to) {
      if (flights.length > 0 && firstFlightStartTime && lastFlightEndTime) {
        const totalDurationMs =
          lastFlightEndTime.getTime() - firstFlightStartTime.getTime();
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
        const selectedFlight: ProviderLeg = {
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

        dfs(
          nextPlanet,
          visited,
          flights,
          totalPrice,
          totalDistance,
          updatedFirstStartTime,
          updatedLastEndTime
        );

        visited.delete(nextPlanet);
        flights.pop();
        totalPrice -= edge.price;
        totalDistance -= edge.distance;
      }
    }
  };

  const visited = new Set<string>();
  visited.add(from);
  dfs(from, visited, [], 0, 0, null, null);

  return allRoutes;
};

export default findAllPaths;
