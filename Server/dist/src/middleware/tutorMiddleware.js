"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tutorModel_1 = __importDefault(require("../models/tutorModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const JWT_SECRET = process.env.JWT_REFRESHSECRET;
    console.log(token, '-----', JWT_SECRET, ".................");
    if (token) {
        try {
            const verifiedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            console.log(verifiedToken, '-----');
            const tutorId = verifiedToken.student_id;
            const tutor = await tutorModel_1.default.findById(tutorId).select("-password");
            console.log(tutor);
            if (tutor) {
                if (tutor.isBlocked) {
                    res.status(403);
                    throw new Error("Access denied, tutor is blocked");
                }
                req.tutor = tutor;
                next();
            }
            else {
                res.status(403);
                throw new Error("Tutor not found");
            }
        }
        catch (error) {
            res.status(401);
            throw new Error("Not authorized, invalid token");
        }
    }
    if (!token) {
        res.status(401).send("Token not found");
    }
});
exports.protect = protect;
