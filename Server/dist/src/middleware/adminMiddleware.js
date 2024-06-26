"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
dotenv_1.default.config();
const isAdmin = (0, express_async_handler_1.default)(async (req, res, next) => {
    console.log(req.headers, 'ppp[pp');
    const token = req.headers.authorization?.split(" ")[1];
    const JWT_SECRET = process.env.JWT_REFRESHSECRET;
    console.log(token, '-----', JWT_SECRET, ".................");
    if (token) {
        try {
            const verifiedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            console.log(verifiedToken, '-----');
            const adminId = verifiedToken.student_id;
            const admin = await adminModel_1.default.findById(adminId).select("-password");
            if (admin) {
                req.admin = admin.toObject();
                next();
            }
            else {
                res.status(403);
                throw new Error("Admin not found");
            }
        }
        catch (error) {
            res.status(401).send("Not authorized, invalid token");
        }
    }
    else {
        res.status(401).send("Token not found");
    }
});
exports.isAdmin = isAdmin;
