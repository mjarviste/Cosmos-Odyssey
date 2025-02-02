import { Edge, ProviderLeg } from "../types/routesData";

export type AdjacencyList = Record<string, Edge[]>;

const buildAdjacencyList = (providerLegs: ProviderLeg[]): AdjacencyList => {
  const adjacency: AdjacencyList = {};

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
    if (!adjacency[from]) adjacency[from] = [];

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

export default buildAdjacencyList;
