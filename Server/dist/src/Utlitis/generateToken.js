"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
var generateAccessToken = function (student_id) {
    var token = jsonwebtoken_1.default.sign({ student_id: student_id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    console.log("token", token);
    return token;
};
exports.generateAccessToken = generateAccessToken;
var generateRefreshToken = function (student_id) {
    var token = jsonwebtoken_1.default.sign({ student_id: student_id }, process.env.JWT_REFRESHSECRET, {
        expiresIn: "50s",
    });
    console.log("token", token);
    return token;
};
exports.generateRefreshToken = generateRefreshToken;