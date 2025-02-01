"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservations_controller_1 = require("../controllers/reservations.controller");
const router = express_1.default.Router();
router.get("/", reservations_controller_1.getReservationList);
router.post("/", reservations_controller_1.addReservation);
exports.default = router;
//# sourceMappingURL=reservations.route.js.map