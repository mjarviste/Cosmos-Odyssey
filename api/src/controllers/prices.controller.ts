import { Request, Response } from "express";
import prisma from "../lib/prisma";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ProviderLeg, RawApiData } from "../types/routesData";
import buildAdjacencyList from "../services/buildAdjacencyList";
import findAllPaths from "../services/findAllPaths";

const clearArray = (array: ProviderLeg[]) => {
  while (array.length > 0) {
    array.pop();
  }
};

const fetchPriceList = async (): Promise<RawApiData> => {
  try {
    const { data } = await axios.get(process.env.COSMOS_ODYSSEY_API_URL || "");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

let routesData: RawApiData = null;

const setRoutesData = (data: RawApiData) => {
  routesData = data;
};

const getRoutesData = () => {
  return routesData;
};

const providerLegs: ProviderLeg[] = [];

const getManyProviderLegs = (filter: string): ProviderLeg[] => {
  if (filter !== "all") {
    const filteredProviderLegs = providerLegs.filter(
      (providerLeg) => providerLeg.companyName === filter
    );
    return filteredProviderLegs;
  }
  return providerLegs;
};

export const getCompanyNames = async (req: Request, res: Response) => {
  try {
    const data = await fetchPriceList();
    const companyNames: string[] = data.legs.reduce<string[]>((names, leg) => {
      leg.providers.forEach((provider) => {
        if (!names.includes(provider.company.name)) {
          names.push(provider.company.name);
        }
      });
      return names;
    }, []);
    res.status(201).json(companyNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch company names" });
  }
};

export const getPlanetNames = async (req: Request, res: Response) => {
  try {
    const data = await fetchPriceList();
    const planetNames: string[] = data.legs.reduce<string[]>((names, leg) => {
      if (!names.includes(leg.routeInfo.from.name)) {
        names.push(leg.routeInfo.from.name);
      }
      if (!names.includes(leg.routeInfo.to.name)) {
        names.push(leg.routeInfo.to.name);
      }
      return names;
    }, []);
    res.status(201).json(planetNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch planet names" });
  }
};

const createProviderLegs = (data: RawApiData) => {
  clearArray(providerLegs);
  data.legs.forEach((leg) => {
    leg.providers.forEach((provider) => {
      providerLegs.push({
        apiId: uuidv4(),
        from: leg.routeInfo.from.name,
        to: leg.routeInfo.to.name,
        distance: leg.routeInfo.distance,
        companyName: provider.company.name,
        price: provider.price,
        flightStart: provider.flightStart,
        flightEnd: provider.flightEnd,
        validUntil: data.validUntil,
      });
    });
  });
};

const storeData = async (validUntil: Date, data: RawApiData) => {
  const storedValidUntil = await prisma.validUntil.create({
    data: {
      validUntil: validUntil,
    },
  });
  const storedRoutesData = await prisma.routesData.create({
    data: {
      apiId: data.id,
      validUntil: new Date(data.validUntil),
      legs: {
        create: data.legs.map((leg) => ({
          apiId: leg.id,
          routeInfo: {
            create: {
              apiId: leg.routeInfo.id,
              distance: leg.routeInfo.distance,
              from: {
                connectOrCreate: {
                  where: { apiId: leg.routeInfo.from.id },
                  create: {
                    apiId: leg.routeInfo.from.id,
                    name: leg.routeInfo.from.name,
                  },
                },
              },
              to: {
                connectOrCreate: {
                  where: { apiId: leg.routeInfo.to.id },
                  create: {
                    apiId: leg.routeInfo.to.id,
                    name: leg.routeInfo.to.name,
                  },
                },
              },
            },
          },
          providers: {
            create: leg.providers.map((provider) => ({
              apiId: provider.id,
              price: provider.price,
              flightStart: new Date(provider.flightStart),
              flightEnd: new Date(provider.flightEnd),
              company: {
                connectOrCreate: {
                  where: { apiId: provider.company.id },
                  create: {
                    apiId: provider.company.id,
                    name: provider.company.name,
                  },
                },
              },
            })),
          },
        })),
      },
    },
  });

  try {
    await Promise.all([storedValidUntil, storedRoutesData]);
  } catch (error) {
    console.error(error);
  }
};

const findLatestValidUntil = async () => {
  try {
    const latestValidUntil = await prisma.validUntil.findFirst({
      orderBy: {
        validUntil: "desc",
      },
    });
    return latestValidUntil;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const findAvailableRoutes = (
  companyFilter: string,
  fromString: string,
  toString: string
) => {
  const currentProviderLegs = getManyProviderLegs(companyFilter);
  const adjacencyList = buildAdjacencyList(currentProviderLegs);
  const allPaths = findAllPaths(adjacencyList, fromString, toString);
  return allPaths;
};

const deleteRoutesData = async (routesDataId: string) => {
  const legs = await prisma.leg.findMany({
    where: { routesDataId },
    select: { id: true, routeInfoId: true },
  });
  const legIds = legs.map((leg) => leg.id);
  const routeInfoIds = legs
    .map((leg) => leg.routeInfoId)
    .filter((id): id is string => !!id);

  await prisma.leg.deleteMany({
    where: { routesDataId },
  });
  await prisma.provider.deleteMany({
    where: {
      legId: { in: legIds },
    },
  });

  await prisma.routeInfo.deleteMany({
    where: {
      id: { in: routeInfoIds },
    },
  });

  await prisma.routesData.delete({
    where: { id: routesDataId },
  });
};

const deleteReservations = async (validUntil: Date) => {
  const reservations = await prisma.reservation.findMany({
    where: { validUntil },
    select: { id: true },
  });
  if (reservations.length === 0) return { message: "No reservations found" };

  const reservationIds = reservations.map((reservation) => reservation.id);

  const pivotRecords = await prisma.reservationProviderLeg.findMany({
    where: { reservationId: { in: reservationIds } },
    select: { providerLegId: true },
  });
  const providerLegIds = pivotRecords.map((record) => record.providerLegId);

  await prisma.reservationProviderLeg.deleteMany({
    where: { reservationId: { in: reservationIds } },
  });

  await prisma.reservation.deleteMany({
    where: { id: { in: reservationIds } },
  });

  const uniqueLegIds = [...new Set(providerLegIds)];
  const orphans: string[] = [];
  for (const legId of uniqueLegIds) {
    const stillUsedCount = await prisma.reservationProviderLeg.count({
      where: { providerLegId: legId },
    });
    if (stillUsedCount === 0) {
      orphans.push(legId);
    }
  }
  if (orphans.length > 0) {
    await prisma.providerLeg.deleteMany({
      where: { id: { in: orphans } },
    });
  }

  return {
    reservationsDeleted: reservationIds,
    pivotDeletedCount: pivotRecords.length,
    orphanedLegsDeleted: orphans.length,
  };
};

const deleteOldData = async () => {
  const allValidUntils = await prisma.validUntil.findMany();
  if (allValidUntils.length > 15) {
    const propValidUntil = allValidUntils[0].validUntil;
    const expiredRoutesData = await prisma.routesData.findFirst({
      where: {
        validUntil: propValidUntil,
      },
    });
    if (expiredRoutesData) {
      await deleteRoutesData(expiredRoutesData.id);
    }
    await deleteReservations(propValidUntil);
    await prisma.validUntil.deleteMany({
      where: {
        validUntil: propValidUntil,
      },
    });
  }
};

export const getPriceList = async (req: Request, res: Response) => {
  const { from, to, filter } = req.query;
  const fromString = String(from);
  const toString = String(to);
  const companyFilter = String(filter);

  try {
    const latestValidUntil = await findLatestValidUntil();
    if (!routesData) {
      setRoutesData(await fetchPriceList());
      createProviderLegs(routesData);
      if (
        latestValidUntil &&
        latestValidUntil.validUntil !== routesData.validUntil
      ) {
        try {
          await storeData(routesData.validUntil, routesData);
          await deleteOldData();
        } catch (error) {
          console.error(error);
        }
      }
    }
    if (latestValidUntil && latestValidUntil.validUntil > new Date()) {
      const allPaths = findAvailableRoutes(companyFilter, fromString, toString);
      res.json(allPaths);
    } else {
      setRoutesData(await fetchPriceList());
      routesData = getRoutesData();
      createProviderLegs(routesData);
      const allPaths = findAvailableRoutes(companyFilter, fromString, toString);
      res.json(allPaths);
      try {
        await storeData(routesData.validUntil, routesData);
        await deleteOldData();
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch price list" });
  }
};
