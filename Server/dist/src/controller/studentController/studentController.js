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
exports.fetchProgress = exports.updatedProgress = exports.getAverageRatings = exports.fetchQuizzesByCourse = exports.getAllRatings = exports.getRating = exports.postReview = exports.updateWalletBalance = exports.getTransactions = exports.getBalance = exports.cancelCourse = exports.getTutorDetails = exports.getTutorList = exports.fetchCategory = exports.enrolledCourses = exports.refreshTokenCreation = exports.deleteCart = exports.stripePayment = exports.StudentEditProfile = exports.removeWishlistItem = exports.getWishlistItems = exports.addToWishlist = exports.removeCartItem = exports.getCartItems = exports.addToCart = exports.getAllCourses = exports.GoogleAuthentication = exports.otpExpiry = exports.studentLogout = exports.newPassword = exports.verifyForgotPassword = exports.forgotPassword = exports.resendOtp = exports.verifyOtp = exports.studentLogin = exports.studentRegistration = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var generateToken_1 = require("../../Utlitis/generateToken");
require("dotenv/config");
var studentModel_1 = __importDefault(require("../../models/studentModel"));
var otpMail_1 = require("../../middleware/otpMail");
var courseModel_1 = __importDefault(require("../../models/courseModel"));
var categoryModel_1 = __importDefault(require("../../models/categoryModel"));
var cartModel_1 = __importDefault(require("../../models/cartModel"));
var wishlistModel_1 = __importDefault(require("../../models/wishlistModel"));
var Cloudinary_1 = require("../../Utlitis/Cloudinary");
var stripe_1 = __importDefault(require("stripe"));
var orderModel_1 = __importDefault(require("../../models/orderModel"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var tutorModel_1 = __importDefault(require("../../models/tutorModel"));
var walletModel_1 = __importDefault(require("../../models/walletModel"));
var ratingModel_1 = __importDefault(require("../../models/ratingModel"));
var questionModel_1 = __importDefault(require("../../models/questionModel"));
var appState = {
    otp: null,
    student: null,
};
var studentRegistration = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentname, studentemail, phone, password, studentExist, student, mail, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, studentname = _a.studentname, studentemail = _a.studentemail, phone = _a.phone, password = _a.password;
                console.log(req.body, "..................");
                if (!studentname || !studentemail || !phone || !password) {
                    return [2 /*return*/, res.status(400).json({ message: " Fill all the fields " })];
                }
                return [4 /*yield*/, studentModel_1.default.findOne({ studentemail: studentemail })];
            case 1:
                studentExist = _b.sent();
                if (studentExist) {
                    return [2 /*return*/, res.status(400).json({ message: "Student already exist" })];
                }
                student = {
                    studentname: studentname,
                    studentemail: studentemail,
                    phone: phone,
                    password: password,
                };
                appState.student = student;
                req.session.student = student;
                if (student) {
                    mail = (0, otpMail_1.sendMail)(student.studentemail, res);
                    console.log(mail, '_______');
                    req.session.otp = mail;
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid user data" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: "Error occured" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.studentRegistration = studentRegistration;
var verifyOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, data, addStudent, token, datas, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                otp = req.body.otp;
                console.log(otp);
                if (!(otp == req.session.otp)) return [3 /*break*/, 2];
                data = req.session.student;
                return [4 /*yield*/, studentModel_1.default.create(data)];
            case 1:
                addStudent = _a.sent();
                token = (0, generateToken_1.generateAccessToken)(addStudent._id);
                datas = {
                    _id: addStudent === null || addStudent === void 0 ? void 0 : addStudent._id,
                    name: addStudent === null || addStudent === void 0 ? void 0 : addStudent.studentname,
                    email: addStudent === null || addStudent === void 0 ? void 0 : addStudent.studentemail,
                    phone: addStudent === null || addStudent === void 0 ? void 0 : addStudent.phone,
                    isBlocked: addStudent.isBlocked,
                    token: token,
                };
                return [2 /*return*/, res.status(200).json({
                        response: datas,
                        token: token
                    })];
            case 2:
                res.status(500).json({ message: "Invalid OTP" });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                res.status(400).json({ message: "Something went wrong" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.verifyOtp = verifyOtp;
var otpExpiry = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('here');
        req.session.otp = null;
        res.status(200).json({ message: "OTP expired please click the resend button " });
        return [2 /*return*/];
    });
}); };
exports.otpExpiry = otpExpiry;
var studentLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentemail, password, student, passwordMatch, accessToken, refreshToken, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, studentemail = _a.studentemail, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, studentModel_1.default.findOne({ studentemail: studentemail }).where({ isBlocked: false })];
            case 2:
                student = _b.sent();
                if (!student) {
                    return [2 /*return*/, res.json({ status: false, message: "Student is not existed" })];
                }
                if ((student === null || student === void 0 ? void 0 : student.isBlocked) == true) {
                    return [2 /*return*/, res.json({ status: false, message: "Student is blocked" })];
                }
                if (!student) return [3 /*break*/, 4];
                return [4 /*yield*/, student.matchPassword(password)];
            case 3:
                passwordMatch = _b.sent();
                if (passwordMatch) {
                    accessToken = (0, generateToken_1.generateAccessToken)(student._id);
                    refreshToken = (0, generateToken_1.generateRefreshToken)(student._id);
                    req.session.accessToken = accessToken;
                    return [2 /*return*/, res.json({ status: true, response: student, token: refreshToken })];
                }
                else {
                    return [2 /*return*/, res.json({ status: false, message: "Invalid email or password" })];
                }
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, res.json({ status: false, message: "Invalid email or password" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _b.sent();
                return [2 /*return*/, res.json({ status: false, message: "Internal server error" })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.studentLogin = studentLogin;
var resendOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, otp;
    return __generator(this, function (_a) {
        try {
            email = req.session.student.studentemail;
            otp = (0, otpMail_1.sendMail)(email, res);
            req.session.otp = otp;
            return [2 /*return*/, res.status(200).json({ message: "OTP resent successfully" })];
        }
        catch (error) {
            return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
        }
        return [2 /*return*/];
    });
}); };
exports.resendOtp = resendOtp;
var refreshTokenCreation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, payload_1, refreshToken;
    return __generator(this, function (_a) {
        try {
            token = req.session.accessToken;
            console.log(token, "ACESSSSSS");
            if (!token)
                return [2 /*return*/, res.status(403).json('token is not found')];
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, function (err, decode) {
                if (err) {
                    return { status: false, message: "error in jwt sign" };
                }
                else {
                    payload_1 = decode;
                }
            });
            if (!payload_1.student_id)
                return [2 /*return*/, { status: false, message: "payload is not found" }];
            refreshToken = (0, generateToken_1.generateRefreshToken)(payload_1.student_id);
            console.log(refreshToken, 'REFRSH TOKEN ');
            res.status(200).json({ status: true, token: refreshToken });
        }
        catch (error) {
        }
        return [2 /*return*/];
    });
}); };
exports.refreshTokenCreation = refreshTokenCreation;
var GoogleAuthentication = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var inComingEmailForVerification, userExists, us, user, response, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                inComingEmailForVerification = req.query.email;
                console.log(inComingEmailForVerification, "incoming email");
                return [4 /*yield*/, studentModel_1.default.findOne({
                        studentemail: inComingEmailForVerification,
                    })];
            case 1:
                userExists = _a.sent();
                if (!userExists) return [3 /*break*/, 2];
                res.send({ userExist: true });
                return [3 /*break*/, 4];
            case 2:
                us = {
                    studentemail: inComingEmailForVerification,
                };
                user = new studentModel_1.default({
                    studentemail: inComingEmailForVerification
                });
                return [4 /*yield*/, user.save()];
            case 3:
                response = _a.sent();
                if (response) {
                    token = (0, generateToken_1.generateAccessToken)(response._id);
                    console.log("hiiiii");
                    res.send({ userExist: true, token: token, response: response });
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.GoogleAuthentication = GoogleAuthentication;
// const forgetData = {
//     otp: null as null | number,
// };
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentemail, studentExists, otpReceived, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentemail = req.body.studentemail;
                console.log(studentemail);
                if (!req.session.student) {
                    req.session.student = {
                        studentname: '',
                        studentemail: '',
                        phone: '',
                        password: ''
                    };
                }
                req.session.student.studentemail = studentemail;
                return [4 /*yield*/, studentModel_1.default.findOne({ studentemail: studentemail })];
            case 1:
                studentExists = _a.sent();
                if (studentExists) {
                    otpReceived = (0, otpMail_1.sendMail)(studentemail, res);
                    console.log(otpReceived, "...............................");
                    req.session.otp = otpReceived;
                    res.status(200).json({ message: "Email sent successfully" });
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "No user exists" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var verifyForgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var otp;
    return __generator(this, function (_a) {
        try {
            otp = req.body.otp;
            console.log(otp, ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
            console.log(req.session.otp, "+++++++++++++++");
            if (otp == req.session.otp) {
                return [2 /*return*/, res.status(200).json({ message: "Success" })];
            }
            else {
                return [2 /*return*/, res.status(400).json({ message: "Please correct password" })];
            }
        }
        catch (error) {
            console.log(error);
        }
        return [2 /*return*/];
    });
}); };
exports.verifyForgotPassword = verifyForgotPassword;
var newPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newPassword_1, studentemail, user, saltRounds, hash, err_1, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                newPassword_1 = req.body.newPassword;
                console.log(newPassword_1, "----------------------------------");
                studentemail = req.session.student.studentemail;
                console.log(studentemail, "............................");
                return [4 /*yield*/, studentModel_1.default.findOne({ studentemail: studentemail })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send({
                            message: "Cannot find user with email: ".concat(studentemail, "."),
                        })];
                }
                saltRounds = 10;
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword_1, saltRounds)];
            case 2:
                hash = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, studentModel_1.default.findOneAndUpdate({ studentemail: studentemail }, { password: hash })];
            case 4:
                _a.sent();
                res.status(200).send({
                    message: "Successfully updated password.",
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                res.status(500).send({
                    message: "Error updating user information.",
                });
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_5 = _a.sent();
                console.log(error_5);
                res.status(500).send({
                    message: "An error occurred.",
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.newPassword = newPassword;
var getAllCourses = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courseDetails, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, courseModel_1.default.find().sort({ createdAt: -1 }).populate('category').populate('tutor').exec()];
            case 1:
                courseDetails = (_a.sent());
                if (courseDetails.length > 0) {
                    return [2 /*return*/, res.status(200).json({ courseDetails: courseDetails })];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ message: "There are no courses" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.log(error_6);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllCourses = getAllCourses;
var addToCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentId, courseId, alreadyEnrolled, cartItemExisted, newCartItem, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, studentId = _a.studentId, courseId = _a.courseId;
                return [4 /*yield*/, orderModel_1.default.findOne({ courseId: courseId, studentId: studentId })];
            case 1:
                alreadyEnrolled = _b.sent();
                if (alreadyEnrolled) {
                    return [2 /*return*/, res.status(400).json({ message: "Student is already enrolled in this course" })];
                }
                return [4 /*yield*/, cartModel_1.default.findOne({ student: studentId, course: courseId })];
            case 2:
                cartItemExisted = _b.sent();
                if (cartItemExisted) {
                    return [2 /*return*/, res.status(400).json({ message: "Course already exists in the cart" })];
                }
                newCartItem = new cartModel_1.default({ student: studentId, course: courseId });
                return [4 /*yield*/, newCartItem.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Course added to cart successfully" })];
            case 4:
                error_7 = _b.sent();
                console.error("Error occurred while adding to cart", error_7);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addToCart = addToCart;
var getCartItems = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, cartItems, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = req.params.studentId;
                console.log(studentId, "........................");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, cartModel_1.default.find({ student: studentId }).populate("course")];
            case 2:
                cartItems = _a.sent();
                console.log(cartItems, "items");
                res.status(200).json(cartItems);
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.error("Error fetching cart Items", error_8);
                res.status(500).json({ error: "Internal server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCartItems = getCartItems;
var removeCartItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartItemId, removedItem, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                cartItemId = req.params.cartItemId;
                return [4 /*yield*/, cartModel_1.default.findByIdAndDelete({ _id: cartItemId })];
            case 1:
                removedItem = _a.sent();
                if (!removedItem) {
                    return [2 /*return*/, res.status(404).json({ error: "Cart item not found" })];
                }
                res.status(200).json({ message: "Course removed from the cart" });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error("Error removing course from cart", error_9);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.removeCartItem = removeCartItem;
var addToWishlist = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentId, courseId, itemExisted, newItem, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, studentId = _a.studentId, courseId = _a.courseId;
                return [4 /*yield*/, wishlistModel_1.default.findOne({ student: studentId, course: courseId })];
            case 1:
                itemExisted = _b.sent();
                if (!itemExisted) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(400).json({ message: "Course already existed in Wishlist" })];
            case 2:
                newItem = new wishlistModel_1.default({ student: studentId, course: courseId });
                return [4 /*yield*/, newItem.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Course added to wishlist successfully" })];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_10 = _b.sent();
                console.error("Error Occur while Adding to wishlist", error_10);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addToWishlist = addToWishlist;
var getWishlistItems = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, wishlistItems, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = req.params.studentId;
                console.log(studentId, "........................");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, wishlistModel_1.default.find({ student: studentId }).populate("course")];
            case 2:
                wishlistItems = _a.sent();
                console.log(wishlistItems, "items");
                res.status(200).json(wishlistItems);
                return [3 /*break*/, 4];
            case 3:
                error_11 = _a.sent();
                console.error("Error fetching cart Items", error_11);
                res.status(500).json({ error: "Internal server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getWishlistItems = getWishlistItems;
var removeWishlistItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var wishlistItemId, removedItem, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                wishlistItemId = req.params.wishlistItemId;
                return [4 /*yield*/, wishlistModel_1.default.findByIdAndDelete({ _id: wishlistItemId })];
            case 1:
                removedItem = _a.sent();
                if (!removedItem) {
                    return [2 /*return*/, res.status(404).json({ error: "Wishlist item not found" })];
                }
                res.status(200).json({ message: "Course removed from the wishlist" });
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.error("Error removing course from wishlist", error_12);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.removeWishlistItem = removeWishlistItem;
var StudentEditProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, _a, studentname, studentemail, phone, file, buffer, imageUrl, updatedStudent, updatedStudent, error_13;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                studentId = (_b = req.student) === null || _b === void 0 ? void 0 : _b._id;
                console.log(studentId);
                console.log(req.body, '==body ');
                console.log(req.file, 'Filessss');
                _a = req.body, studentname = _a.studentname, studentemail = _a.studentemail, phone = _a.phone;
                if (!req.file) return [3 /*break*/, 3];
                file = req.file;
                buffer = file.buffer;
                return [4 /*yield*/, (0, Cloudinary_1.uploadCloud)(buffer, file.originalname)];
            case 1:
                imageUrl = _c.sent();
                console.log(imageUrl, 'URL ');
                return [4 /*yield*/, studentModel_1.default.findByIdAndUpdate(studentId, {
                        studentname: studentname,
                        studentemail: studentemail,
                        phone: phone,
                        photo: imageUrl,
                    }, { new: true })];
            case 2:
                updatedStudent = _c.sent();
                if (updatedStudent) {
                    res.status(200).json({ status: true, data: updatedStudent });
                }
                else {
                    res.status(404).json({ status: false, message: "Tutor not found" });
                }
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, studentModel_1.default.findByIdAndUpdate(studentId, {
                    studentname: studentname,
                    studentemail: studentemail,
                    phone: phone,
                }, { new: true })];
            case 4:
                updatedStudent = _c.sent();
                if (updatedStudent) {
                    res.status(200).json({ status: true, data: updatedStudent });
                }
                else {
                    res.status(404).json({ status: false, message: "Student not found" });
                }
                _c.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_13 = _c.sent();
                console.error("Error updating profile:", error_13);
                res.status(500).json({ status: false, message: "Failed to update profile" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.StudentEditProfile = StudentEditProfile;
require("dotenv").config();
var stripeSecretKey = process.env.STRIPE_KEY;
console.log(stripeSecretKey, "Keyy");
var stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2024-04-10",
});
var stripePayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var line_items, session, orderPromises, orders, err_2;
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
                                        paymentMethod: 'Stripe',
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
                err_2 = _a.sent();
                console.error("Stripe Payment Error:", err_2);
                res.status(500).json({ error: "Payment error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.stripePayment = stripePayment;
var deleteCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, clearCart, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentId = req.body.id;
                console.log(studentId, "iddddddddddddddddddddddddd");
                return [4 /*yield*/, cartModel_1.default.deleteMany({ student: studentId })];
            case 1:
                clearCart = _a.sent();
                if (clearCart.deletedCount > 0) {
                    return [2 /*return*/, res.json({ status: true })];
                }
                else {
                    return [2 /*return*/, res.json({ status: false })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.error("Error clearing cart:", error_14);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCart = deleteCart;
var enrolledCourses = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, enrolledCourses_1, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentId = req.params.studentId;
                console.log(studentId, "............");
                return [4 /*yield*/, orderModel_1.default.find({
                        studentId: studentId
                    })
                        .populate("studentId")
                        .populate("courseId")
                        .populate("tutorId").sort({ createdAt: -1 })];
            case 1:
                enrolledCourses_1 = _a.sent();
                console.log(enrolledCourses_1, "................");
                return [2 /*return*/, res.status(200).json(enrolledCourses_1)];
            case 2:
                error_15 = _a.sent();
                console.error("Error clearing cart:", error_15);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.enrolledCourses = enrolledCourses;
var fetchCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, category, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                categoryId = req.params.categoryId;
                return [4 /*yield*/, categoryModel_1.default.find({ _id: categoryId })];
            case 1:
                category = _a.sent();
                console.log(category, ",,,,,,,,,,,,,,,,,,,,,,,,");
                if (category) {
                    return [2 /*return*/, res.status(200).json({ category: category, message: "category fetched" })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "category not found" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                console.log(error_16);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchCategory = fetchCategory;
var getTutorList = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tutorDetails, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, tutorModel_1.default.find().exec()];
            case 1:
                tutorDetails = _a.sent();
                if (tutorDetails) {
                    res.status(200).json({
                        tutorDetails: tutorDetails,
                    });
                }
                else {
                    return [2 /*return*/, res.status(400).json({
                            message: "no users in this table",
                        })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                console.log(error_17);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTutorList = getTutorList;
var getTutorDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, tutorDetails, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(req.params, "req.params");
                id = req.params.id;
                return [4 /*yield*/, tutorModel_1.default.findById(id)];
            case 1:
                tutorDetails = _a.sent();
                console.log(tutorDetails, "tutorDetails");
                if (tutorDetails) {
                    res.status(200).json({
                        tutorDetails: tutorDetails,
                    });
                }
                else {
                    return [2 /*return*/, res.status(400).json({
                            message: "no users in this table",
                        })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_18 = _a.sent();
                console.log(error_18);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTutorDetails = getTutorDetails;
var cancelCourse = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, courseId_1, studentId, courseOrder, coursePrice, courseCancelled, studentWallet, enrollment, error_19;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, courseId_1 = _a.courseId, studentId = _a.studentId;
                console.log(req.body, "**********************************");
                return [4 /*yield*/, orderModel_1.default.findOne({ courseId: courseId_1, studentId: studentId })];
            case 1:
                courseOrder = _b.sent();
                if (!courseOrder) {
                    return [2 /*return*/, res.status(400).json({ message: "Course not found" })];
                }
                coursePrice = courseOrder.amount;
                return [4 /*yield*/, orderModel_1.default.findOneAndDelete({ courseId: courseId_1, studentId: studentId })];
            case 2:
                courseCancelled = _b.sent();
                console.log(courseCancelled);
                if (!courseCancelled) return [3 /*break*/, 5];
                return [4 /*yield*/, walletModel_1.default.findOne({ studentId: studentId })];
            case 3:
                studentWallet = _b.sent();
                if (!studentWallet) {
                    studentWallet = new walletModel_1.default({
                        studentId: studentId,
                        balance: coursePrice,
                        transactions: [{
                                type: 'credit',
                                amount: coursePrice,
                                date: new Date(),
                            }],
                        enrollments: [{
                                courseId: courseId_1,
                                date: new Date(),
                                refunded: true,
                            }],
                    });
                }
                else {
                    studentWallet.balance += coursePrice;
                    studentWallet.transactions.push({
                        type: 'credit',
                        amount: coursePrice,
                        date: new Date(),
                    });
                    enrollment = studentWallet.enrollments.find(function (enrollment) {
                        return enrollment.courseId.toString() === courseId_1.toString();
                    });
                    if (enrollment) {
                        enrollment.refunded = true;
                    }
                    else {
                        studentWallet.enrollments.push({
                            courseId: courseId_1,
                            date: new Date(),
                            refunded: true,
                        });
                    }
                }
                return [4 /*yield*/, studentWallet.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Course cancelled and amount refunded to wallet" })];
            case 5: return [2 /*return*/, res.status(400).json({ message: "Not able to cancel the course" })];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_19 = _b.sent();
                console.log(error_19);
                return [2 /*return*/, res.status(500).json({ message: "An error occurred" })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.cancelCourse = cancelCourse;
var getBalance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, wallet, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentId = req.params.studentId;
                console.log(studentId, "..............................");
                return [4 /*yield*/, walletModel_1.default.findOne({ studentId: studentId })];
            case 1:
                wallet = _a.sent();
                if (wallet) {
                    return [2 /*return*/, res.status(200).json(wallet.balance)];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "Balance is not available" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_20 = _a.sent();
                console.error(error_20);
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getBalance = getBalance;
var getTransactions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, wallet, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentId = req.params.studentId;
                console.log(studentId, "..............................");
                return [4 /*yield*/, walletModel_1.default.findOne({ studentId: studentId })];
            case 1:
                wallet = _a.sent();
                if (wallet && wallet.transactions.length > 0) {
                    return [2 /*return*/, res.status(200).json(wallet.transactions)];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ message: "Transactions are not available" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_21 = _a.sent();
                console.error(error_21);
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTransactions = getTransactions;
var updateWalletBalance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentId_1, amount, cartItems, wallet, orders, error_22;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, studentId_1 = _a.studentId, amount = _a.amount, cartItems = _a.cartItems;
                return [4 /*yield*/, walletModel_1.default.findOne({ studentId: studentId_1 })];
            case 1:
                wallet = _b.sent();
                if (!wallet) {
                    return [2 /*return*/, res.status(404).json({ message: 'Wallet not found' })];
                }
                if (wallet.balance + amount < 0) {
                    return [2 /*return*/, res.status(400).json({ message: 'Insufficient balance' })];
                }
                wallet.balance += amount;
                wallet.transactions.push({
                    type: amount < 0 ? 'debit' : 'credit',
                    amount: Math.abs(amount),
                    date: new Date(),
                });
                orders = cartItems.map(function (cartItem) {
                    var _a, _b;
                    return ({
                        studentId: studentId_1,
                        tutorId: (_a = cartItem.course[0]) === null || _a === void 0 ? void 0 : _a.tutor,
                        courseId: cartItem.course[0]._id,
                        amount: (_b = cartItem.course[0]) === null || _b === void 0 ? void 0 : _b.courseFee,
                        status: 'success',
                        paymentMethod: 'Wallet',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                });
                return [4 /*yield*/, orderModel_1.default.insertMany(orders)];
            case 2:
                _b.sent();
                return [4 /*yield*/, wallet.save()];
            case 3:
                _b.sent();
                res.status(200).json({ message: 'Wallet balance updated and orders created successfully', walletBalance: wallet.balance });
                return [3 /*break*/, 5];
            case 4:
                error_22 = _b.sent();
                console.error("Error updating wallet balance and creating orders:", error_22);
                res.status(500).json({ message: 'Error updating wallet balance and creating orders' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateWalletBalance = updateWalletBalance;
var postReview = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, review, rating, courseId, studentId, submittedReview, error_23;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, review = _a.review, rating = _a.rating, courseId = _a.courseId, studentId = _a.studentId;
                console.log(req.body);
                return [4 /*yield*/, ratingModel_1.default.findOne({ courseId: courseId, studentId: studentId })];
            case 1:
                submittedReview = _b.sent();
                if (!!submittedReview) return [3 /*break*/, 3];
                submittedReview = new ratingModel_1.default({
                    courseId: courseId,
                    studentId: studentId,
                    rating: rating,
                    review: review
                });
                return [4 /*yield*/, submittedReview.save()];
            case 2:
                _b.sent();
                return [3 /*break*/, 5];
            case 3:
                submittedReview.review = review;
                submittedReview.rating = rating;
                return [4 /*yield*/, submittedReview.save()];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                res.status(200).json({ message: "Review submitted successfully", rating: submittedReview });
                return [3 /*break*/, 7];
            case 6:
                error_23 = _b.sent();
                console.error("Error while submitting review:", error_23);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.postReview = postReview;
var getRating = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, courseId, studentId, studentRating, error_24;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, courseId = _a.courseId, studentId = _a.studentId;
                return [4 /*yield*/, ratingModel_1.default.find({ courseId: courseId, studentId: studentId }).populate('studentId')];
            case 1:
                studentRating = _b.sent();
                if (!studentRating) {
                    return [2 /*return*/, res.status(400).json({ message: "Rating details not found" })];
                }
                else {
                    return [2 /*return*/, res.status(200).json({ message: "My rating details", data: studentRating })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_24 = _b.sent();
                console.error("Error fetching rating:", error_24);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getRating = getRating;
var getAllRatings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courseId, allRatings, error_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                courseId = req.params.courseId;
                if (!courseId) {
                    return [2 /*return*/, res.status(400).json({ message: "Course ID is required" })];
                }
                return [4 /*yield*/, ratingModel_1.default.find({ courseId: courseId }).populate('studentId')];
            case 1:
                allRatings = _a.sent();
                if (allRatings.length > 0) {
                    return [2 /*return*/, res.status(200).json({ message: "Ratings are fetched", allRatings: allRatings })];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ message: "There are no ratings for this course" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_25 = _a.sent();
                console.error("Error while fetching ratings:", error_25);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllRatings = getAllRatings;
var fetchQuizzesByCourse = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courseId, questions, error_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                courseId = req.params.courseId;
                return [4 /*yield*/, questionModel_1.default.find({ courseId: courseId })];
            case 1:
                questions = _a.sent();
                return [2 /*return*/, res.status(200).json(questions)];
            case 2:
                error_26 = _a.sent();
                console.error("Error while fetching ratings:", error_26);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchQuizzesByCourse = fetchQuizzesByCourse;
var getAverageRatings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var averageRatings, error_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ratingModel_1.default.aggregate([
                        {
                            $group: {
                                _id: "$courseId",
                                averageRating: { $avg: "$rating" },
                                ratingCount: { $sum: 1 }
                            }
                        }
                    ])];
            case 1:
                averageRatings = _a.sent();
                if (averageRatings.length > 0) {
                    return [2 /*return*/, res.status(200).json({ averageRatings: averageRatings })];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ message: "No ratings found" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_27 = _a.sent();
                console.error("Error fetching average ratings:", error_27);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAverageRatings = getAverageRatings;
var updatedProgress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, courseId, studentId, lessonId, course, studentProgress, lessonProgress, error_28;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, courseId = _a.courseId, studentId = _a.studentId, lessonId = _a.lessonId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, courseModel_1.default.findById(courseId)];
            case 2:
                course = _b.sent();
                if (!course) {
                    return [2 /*return*/, res.status(404).send({ message: 'Course not found' })];
                }
                studentProgress = course.studentsProgress.find(function (sp) { return sp.studentId.toString() === studentId; });
                if (studentProgress) {
                    lessonProgress = studentProgress.progress.find(function (lp) { return lp.lessonId.toString() === lessonId; });
                    if (lessonProgress) {
                        lessonProgress.isCompleted = true;
                    }
                    else {
                        studentProgress.progress.push({ lessonId: lessonId, isCompleted: true });
                    }
                }
                else {
                    course.studentsProgress.push({
                        studentId: studentId,
                        progress: [{ lessonId: lessonId, isCompleted: true }]
                    });
                }
                return [4 /*yield*/, course.save()];
            case 3:
                _b.sent();
                res.status(200).send({ message: 'Progress updated successfully' });
                return [3 /*break*/, 5];
            case 4:
                error_28 = _b.sent();
                res.status(500).send({ message: 'Failed to update progress', error: error_28 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updatedProgress = updatedProgress;
var fetchProgress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, courseId, studentId, course, studentProgress, watchedLessons, error_29;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, courseId = _a.courseId, studentId = _a.studentId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, courseModel_1.default.findById(courseId)];
            case 2:
                course = _b.sent();
                if (!course) {
                    return [2 /*return*/, res.status(404).json({ msg: 'Course not found' })];
                }
                studentProgress = course.studentsProgress.find(function (sp) { return sp.studentId.toString() === studentId; });
                if (!studentProgress) {
                    return [2 /*return*/, res.json({ status: true, data: { watchedLessons: [] } })];
                }
                watchedLessons = studentProgress.progress.filter(function (lesson) { return lesson.isCompleted; });
                res.json({ status: true, data: { watchedLessons: watchedLessons } });
                return [3 /*break*/, 4];
            case 3:
                error_29 = _b.sent();
                console.error('Error fetching student progress:', error_29);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.fetchProgress = fetchProgress;
var studentLogout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.status(200).json({ message: "Logout successful" });
        }
        catch (error) {
            console.error("Logout Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
        return [2 /*return*/];
    });
}); };
exports.studentLogout = studentLogout;
