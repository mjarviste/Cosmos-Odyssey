import { Request, Response } from "express";
import prisma from "../lib/prisma";
import axios from "axios";
import {
  Leg,
  RoutesData,
  Planet,
  RouteInfo,
  Provider,
  Company,
  RoutePath,
} from "../types/routesData";
import loadAllLegs from "../services/getAllLegs";
import buildAdjacencyList from "../services/buildAdjacencyList";
import findAllPaths from "../services/findAllPaths";

const fetchPriceList = async (): Promise<RoutesData> => {
  const { data } = await axios.get(process.env.COSMOS_ODYSSEY_API_URL || "");

  const routesData: RoutesData = {
    apiId: data.id,
    validUntil: new Date(data.validUntil),
    legs: data.legs.map((leg: any) => {
      const fromPlanet: Planet = {
        apiId: leg.routeInfo.from.id,
        name: leg.routeInfo.from.name,
      };
      const toPlanet: Planet = {
        apiId: leg.routeInfo.to.id,
        name: leg.routeInfo.to.name,
      };

      const routeInfo: RouteInfo = {
        apiId: leg.routeInfo.id,
        distance: leg.routeInfo.distance,
        from: fromPlanet,
        to: toPlanet,
      };

      const providers: Provider[] = leg.providers.map((provider: any) => {
        const apiId: string = provider.id;
        const price: number = provider.price;
        const flightStart: Date = new Date(provider.flightStart);
        const flightEnd: Date = new Date(provider.flightEnd);
        const company: Company = {
          apiId: provider.company.id,
          name: provider.company.name,
        };
        return { apiId, price, flightStart, flightEnd, company };
      });

      return {
        apiId: leg.id,
        routeInfo,
        providers,
      };
    }),
  };

  return routesData;
};

const storeData = async (data: RoutesData) => {
  await prisma.routesData.create({
    data: {
      apiId: data.apiId,
      validUntil: data.validUntil,
      legs: {
        create: data.legs.map((leg) => ({
          apiId: leg.apiId,
          routeInfo: {
            connectOrCreate: {
              where: { apiId: leg.routeInfo.apiId },
              create: {
                apiId: leg.routeInfo.apiId,
                distance: leg.routeInfo.distance,
                from: {
                  connectOrCreate: {
                    where: { apiId: leg.routeInfo.from.apiId },
                    create: {
                      apiId: leg.routeInfo.from.apiId,
                      name: leg.routeInfo.from.name,
                    },
                  },
                },
                to: {
                  connectOrCreate: {
                    where: { apiId: leg.routeInfo.to.apiId },
                    create: {
                      apiId: leg.routeInfo.to.apiId,
                      name: leg.routeInfo.to.name,
                    },
                  },
                },
              },
            },
          },
          providers: {
            create: leg.providers.map((provider) => ({
              apiId: provider.apiId,
              flightStart: provider.flightStart,
              flightEnd: provider.flightEnd,
              price: provider.price,
              company: {
                connectOrCreate: {
                  where: { apiId: provider.company.apiId },
                  create: {
                    apiId: provider.company.apiId,
                    name: provider.company.name,
                  },
                },
              },
            })),
          },
        })),
      },
    },
    include: {
      legs: {
        include: {
          routeInfo: {
            include: { from: true, to: true },
          },
          providers: {
            include: { company: true },
          },
        },
      },
    },
  });
};

export const getPriceList = async (req: Request, res: Response) => {
  try {
    const legs: Leg[] = await loadAllLegs();

    const adjacencyList = buildAdjacencyList(legs);

    const {
      from = "Neptune",
      to = "Earth",
      page = "1",
      limit = "10",
    } = req.query;
    const origin = String(from);
    const destination = String(to);
    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);

    const allPaths: RoutePath[] = findAllPaths(
      adjacencyList,
      origin,
      destination
    );

    const sortedRoutes = allPaths.sort(
      (a, b) => a.totalDistance - b.totalDistance
    );

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedRoutes = sortedRoutes.slice(startIndex, endIndex);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      totalRoutes: sortedRoutes.length,
      routes: paginatedRoutes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch price list" });
  }
};
