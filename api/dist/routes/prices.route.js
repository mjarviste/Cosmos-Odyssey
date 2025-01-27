"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prices_controller_1 = require("../controllers/prices.controller");
const router = express_1.default.Router();
router.get("/", prices_controller_1.getPriceList);
exports.default = router;
//# sourceMappingURL=prices.route.js.map