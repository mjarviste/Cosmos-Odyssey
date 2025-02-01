import prisma from "../lib/prisma";
import { ProviderLeg } from "../types/routesData";

const loadAllLegs = async (filter: string, validUntil: Date) => {
  let providerLegs: ProviderLeg[] = [];
  if (filter === "all") {
    providerLegs = await prisma.providerLeg.findMany({
      where: {
        validUntil: validUntil,
      },
      include: {
        company: true,
      },
    });
  } else {
    providerLegs = await prisma.providerLeg.findMany({
      where: {
        validUntil: validUntil,
        company: {
          name: filter,
        },
      },
      include: {
        company: true,
      },
    });
  }

  return providerLegs.map((providerLeg: ProviderLeg) => ({
    id: providerLeg.id,
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
