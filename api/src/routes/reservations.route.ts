import express from "express";
import {
  getReservationList,
  addReservation,
} from "../controllers/reservations.controller";
const router = express.Router();

router.get("/", getReservationList);
router.post("/", addReservation);
export default router;
