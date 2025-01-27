import prisma from "../lib/prisma";

const loadAllLegs = async () => {
  const legs = await prisma.leg.findMany({
    include: {
      routeInfo: {
        include: { from: true, to: true },
      },
      providers: {
        include: {
          company: true,
        },
      },
    },
  });
  return legs.map((leg) => ({
    apiId: leg.apiId,
    routeInfo: {
      apiId: leg.routeInfo.apiId,
      distance: leg.routeInfo.distance,
      from: {
        apiId: leg.routeInfo.from.apiId,
        name: leg.routeInfo.from.name,
      },
      to: {
        apiId: leg.routeInfo.to.apiId,
        name: leg.routeInfo.to.name,
      },
    },
    providers: leg.providers.map((provider) => ({
      apiId: provider.apiId,
      price: provider.price,
      flightStart: provider.flightStart,
      flightEnd: provider.flightEnd,
      company: {
        apiId: provider.company.apiId,
        name: provider.company.name,
      },
    })),
  }));
};

export default loadAllLegs;
