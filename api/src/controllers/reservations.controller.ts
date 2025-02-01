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

// export const addReservation = async (req: Request, res: Response) => {
//   const { firstName, lastName, path } = req.body;
//   console.log(path);
//   try {
//     const reservation = await prisma.reservation.create({
//       data: {
//         validUntil: path.validUntil,
//         firstName,
//         lastName,
//         fullName: firstName + " " + lastName,
//         companyNames: path.flights.map((flight) => flight.company.name),
//         routeOption: {
//           connectOrCreate: {
//             where: {
//               totalPrice_totalTravelTime_providerLegIds: {
//                 totalPrice: path.totalPrice,
//                 totalTravelTime: path.totalTravelTime,
//                 providerLegIds: path.flights.map((flight) => flight.id).sort(),
//               },
//             },
//             create: {
//               totalPrice: path.totalPrice,
//               totalTravelTime: path.totalTravelTime,
//               providerLegIds: path.flights.map((flight) => flight.id),
//               flights: {
//                 connect: path.flights.map((flight) => ({ id: flight.id })),
//               },
//               validUntil: path.validUntil,
//             },
//           },
//         },
//       },
//       include: {
//         routeOption: {
//           include: { flights: true },
//         },
//       },
//     });
//     res.status(201).json(reservation);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating the reservation." });
//   }
// };

// export const addReservation = async (req: Request, res: Response) => {
//   const { firstName, lastName, path } = req.body;
//   try {
//     const reservation = await prisma.reservation.create({
//       data: {
//         validUntil: path.validUntil,
//         firstName,
//         lastName,
//         fullName: firstName + " " + lastName,
//         companyNames: path.flights.map((flight) => flight.company.name),
//         routeOption: {
//           connectOrCreate: {
//             where: {
//               totalPrice_totalTravelTime_providerLegIds: {
//                 totalPrice: path.totalPrice,
//                 totalTravelTime: path.totalTravelTime,
//                 providerLegIds: path.flights.map((flight) => flight.id),
//               },
//             },
//             create: {
//               totalPrice: path.totalPrice,
//               totalTravelTime: path.totalTravelTime,
//               providerLegIds: path.flights.map((flight) => flight.id),
//               flights: {
//                 connect: path.flights.map((flight) => ({ id: flight.id })),
//               },
//               validUntil: path.validUntil,
//             },
//           },
//         },
//       },
//       include: {
//         routeOption: {
//           include: {
//             flights: true,
//           },
//         },
//       },
//     });
//     res.status(201).json(reservation);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating the reservation." });
//   }
// };

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
        companyNames: path.flights.map((flight) => flight.company.name),
        flights: {
          create: path.flights.map((flight) => ({
            providerLeg: {
              connect: { id: flight.id },
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
