import { Edge, Leg, ProviderInfo } from "../types/routesData";

export type AdjacencyList = Record<string, Edge[]>;

const buildAdjacencyList = (legs: Leg[]): AdjacencyList => {
  const adjacency: AdjacencyList = {};

  legs.forEach((leg) => {
    const fromName = leg.routeInfo.from.name;
    const toName = leg.routeInfo.to.name;
    const distance = leg.routeInfo.distance;
    const legApiId = leg.apiId;

    const providerInfos: ProviderInfo[] = leg.providers.map((provider) => ({
      providerApiId: provider.apiId,
      price: provider.price,
      flightStart: provider.flightStart,
      flightEnd: provider.flightEnd,
      companyName: provider.company.name,
    }));

    if (!adjacency[fromName]) adjacency[fromName] = [];

    const addEdge = (
      from: string,
      to: string,
      distance: number,
      legApiId: string,
      providers: ProviderInfo
    ) => {
      const existingEdge = adjacency[from].find(
        (edge) => edge.to === to && edge.legApiId === legApiId
      );
      if (existingEdge) {
        existingEdge.providers.push(providers);
      } else {
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

export default buildAdjacencyList;
