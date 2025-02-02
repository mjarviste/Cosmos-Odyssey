import express from "express";
import {
  getCompanyNames,
  getPlanetNames,
  getPriceList,
} from "../controllers/prices.controller";
const router = express.Router();

router.get("/", getPriceList);
router.get("/companies", getCompanyNames);
router.get("/planets", getPlanetNames);

export default router;
