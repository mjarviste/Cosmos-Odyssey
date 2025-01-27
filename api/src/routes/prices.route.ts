import express from "express";
import { getPriceList } from "../controllers/prices.controller";
const router = express.Router();

router.get("/", getPriceList);
export default router;
