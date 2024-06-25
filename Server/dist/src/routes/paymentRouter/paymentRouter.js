"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var paymentController_1 = require("../../controller/paymentController/paymentController");
var paymentRouter = express_1.default.Router();
paymentRouter.post('/stripepayment', paymentController_1.stripePayment);
exports.default = paymentRouter;
