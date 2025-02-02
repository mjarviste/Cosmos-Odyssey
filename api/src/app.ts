import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import priceListRouter from "./routes/prices.route";
import reservationListRouter from "./routes/reservations.route";
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/prices", priceListRouter);
app.use("/api/reservations", reservationListRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
