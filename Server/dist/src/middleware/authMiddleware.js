"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isAuth = (0, express_async_handler_1.default)(async (req, res, next) => {
    console.log(req.headers, 'ppp[pp');
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    const JWT_SECRET = process.env.JWT_REFRESHSECRET;
    if (token) {
        try {
            const verifiedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            console.log(verifiedToken, '-----');
            const studentId = verifiedToken.student_id;
            const student = await studentModel_1.default.findById(studentId).select("-password");
            if (student) {
                if (student.isBlocked) {
                    res.status(403);
                    throw new Error("Access denied, student is blocked");
                }
                req.student = student;
                next();
            }
            else {
                res.status(403);
                throw new Error("Student not found");
            }
        }
        catch (error) {
            console.log(error, '0000000000000');
            res.status(401);
            throw new Error("Not authorized, invalid token");
        }
    }
    if (!token) {
        res.status(401).send("Token not found");
    }
});
exports.isAuth = isAuth;
