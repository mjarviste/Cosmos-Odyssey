import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getReservationList = async (req: Request, res: Response) => {
  const { firstName, lastName } = req.query;
  const fullName = firstName + " " + lastName;

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        fullName,
      },
      include: {
        flights: {
          include: {
            providerLeg: true,
          },
        },
      },
    });
    res.status(201).json(reservations);
  } catch (error) {
    console.error(error);
  }
};

export const addReservation = async (req: Request, res: Response) => {
  const { firstName, lastName, path } = req.body;
  try {
    const reservation = await prisma.reservation.create({
      data: {
        validUntil: new Date(path.validUntil),
        firstName,
        lastName,
        totalPrice: path.totalPrice,
        totalTravelTime: path.totalTravelTime,
        fullName: firstName + " " + lastName,
        companyNames: path.flights.map((flight) => flight.companyName),
        flights: {
          create: path.flights.map((flight) => ({
            providerLeg: {
              connectOrCreate: {
                where: {
                  apiId: flight.apiId,
                },
                create: {
                  apiId: flight.apiId,
                  from: flight.from,
                  to: flight.to,
                  distance: flight.distance,
                  companyName: flight.companyName,
                  price: flight.price,
                  flightStart: new Date(flight.flightStart),
                  flightEnd: new Date(flight.flightEnd),
                  validUntil: new Date(flight.validUntil),
                },
              },
            },
          })),
        },
      },
      include: {
        flights: {
          include: {
            providerLeg: true,
          },
        },
      },
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the reservation." });
  }
};
