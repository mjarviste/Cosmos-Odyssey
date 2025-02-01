"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReservation = exports.getReservationList = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getReservationList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName } = req.query;
    const fullName = firstName + " " + lastName;
    try {
        const reservations = yield prisma_1.default.reservation.findMany({
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
    }
    catch (error) {
        console.error(error);
    }
});
exports.getReservationList = getReservationList;
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
const addReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, path } = req.body;
    try {
        const reservation = yield prisma_1.default.reservation.create({
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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while creating the reservation." });
    }
});
exports.addReservation = addReservation;
//# sourceMappingURL=reservations.controller.js.map