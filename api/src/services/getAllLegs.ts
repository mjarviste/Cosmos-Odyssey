import prisma from "../lib/prisma";
import { ProviderLeg } from "../types/routesData";

const loadAllLegs = async (filter: string) => {
  let providerLegs: ProviderLeg[] = [];
  if (filter === "all") {
    providerLegs = await prisma.providerLeg.findMany({
      include: {
        company: true,
      },
    });
  } else {
    providerLegs = await prisma.providerLeg.findMany({
      where: {
        companyId: filter,
      },
      include: {
        company: true,
      },
    });
  }
  return providerLegs.map((providerLeg: ProviderLeg) => ({
    from: providerLeg.from,
    to: providerLeg.to,
    distance: providerLeg.distance,
    companyId: providerLeg.companyId,
    company: {
      name: providerLeg.company.name,
    },
    price: providerLeg.price,
    flightStart: providerLeg.flightStart,
    flightEnd: providerLeg.flightEnd,
    validUntil: providerLeg.validUntil,
  }));
};

export default loadAllLegs;
