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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripePayment = void 0;
var stripe_1 = __importDefault(require("stripe"));
var courseModel_1 = __importDefault(require("../../models/courseModel"));
var orderModel_1 = __importDefault(require("../../models/orderModel"));
require("dotenv").config();
var stripeSecretKey = process.env.STRIPE_KEY;
console.log(stripeSecretKey, "Keyy");
var stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2024-04-10",
});
var stripePayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var line_items, session, orderPromises, orders, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                console.log(req.body, "bodyyyyyyyyyyyyyyy");
                line_items = req.body.cartItems.map(function (item) {
                    var _a, _b, _c, _d;
                    console.log(item, "ONE ITEM");
                    return {
                        price_data: {
                            currency: "INR",
                            product_data: {
                                name: (_a = item === null || item === void 0 ? void 0 : item.course[0]) === null || _a === void 0 ? void 0 : _a.courseName,
                                images: (_b = item === null || item === void 0 ? void 0 : item.course[0]) === null || _b === void 0 ? void 0 : _b.photo,
                                description: (_c = item === null || item === void 0 ? void 0 : item.course[0]) === null || _c === void 0 ? void 0 : _c.courseDescription,
                                metadata: {
                                    id: item._id,
                                },
                            },
                            unit_amount: ((_d = item === null || item === void 0 ? void 0 : item.course[0]) === null || _d === void 0 ? void 0 : _d.courseFee) * 100,
                        },
                        quantity: 1,
                    };
                });
                console.log(line_items, "LINEITEMSSSS");
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        line_items: line_items,
                        mode: "payment",
                        billing_address_collection: "required",
                        success_url: "".concat(process.env.CLIENT_URL, "/paymentSuccess"),
                        cancel_url: "".concat(process.env.CLIENT_URL, "/cart"),
                    })];
            case 1:
                session = _a.sent();
                console.log(session.payment_status, "status", process.env.CLIENT_URL);
                if (!(session.payment_status === "unpaid")) return [3 /*break*/, 3];
                orderPromises = req.body.cartItems.map(function (cartItem) { return __awaiter(void 0, void 0, void 0, function () {
                    var studentId, tutorId, courseId, amount, order;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                studentId = cartItem === null || cartItem === void 0 ? void 0 : cartItem.student;
                                tutorId = (_a = cartItem === null || cartItem === void 0 ? void 0 : cartItem.course[0]) === null || _a === void 0 ? void 0 : _a.tutor;
                                courseId = cartItem === null || cartItem === void 0 ? void 0 : cartItem.course[0]._id;
                                amount = (_b = cartItem === null || cartItem === void 0 ? void 0 : cartItem.course[0]) === null || _b === void 0 ? void 0 : _b.courseFee;
                                return [4 /*yield*/, orderModel_1.default.create({
                                        studentId: studentId,
                                        tutorId: tutorId,
                                        courseId: courseId,
                                        amount: amount,
                                    })];
                            case 1:
                                order = _c.sent();
                                return [4 /*yield*/, order.save()];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, courseModel_1.default.findByIdAndUpdate(courseId, {
                                        $push: { students: studentId },
                                    })];
                            case 3:
                                _c.sent();
                                console.log("Order saved:", order);
                                return [2 /*return*/, order];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(orderPromises)];
            case 2:
                orders = _a.sent();
                res.json({
                    status: true,
                    url: session.url,
                    orderIds: orders.map(function (order) { return order._id; }),
                    cart: req.body.cartItems
                });
                return [3 /*break*/, 4];
            case 3:
                res.status(400).json({ error: "Payment not completed yet." });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.error("Stripe Payment Error:", err_1);
                res.status(500).json({ error: "Payment error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.stripePayment = stripePayment;
