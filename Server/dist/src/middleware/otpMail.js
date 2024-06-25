"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
});
var sendMail = function (receiverMail, res) {
    var otp = parseInt((Math.random() * 1000000).toString(), 10);
    var appState = otp;
    console.log(otp, '/000000');
    var mailInfo = {
        from: process.env.AUTH_EMAIL,
        to: receiverMail,
        subject: "Verify your account",
        html: "<h3>Your OTP is</h3><h1 style='font-weight:bold;'>".concat(otp, "</h1>"),
        text: "A simple message in text format"
    };
    transporter.sendMail(mailInfo, function (error) {
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
