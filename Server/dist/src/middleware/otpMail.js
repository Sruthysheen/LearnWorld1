"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
});
const sendMail = (receiverMail, res) => {
    const otp = parseInt((Math.random() * 1000000).toString(), 10);
    const appState = otp;
    console.log(otp, '/000000');
    const mailInfo = {
        from: process.env.AUTH_EMAIL,
        to: receiverMail,
        subject: "Verify your account",
        html: `<h3>Your OTP is</h3><h1 style='font-weight:bold;'>${otp}</h1>`,
        text: "A simple message in text format"
    };
    transporter.sendMail(mailInfo, (error) => {
        if (error) {
            res.status(500).json({ message: "Email sending failed" });
        }
        else {
            res.status(200).json({ message: "Email sent successfully" });
        }
    });
    return appState;
};
exports.sendMail = sendMail;
