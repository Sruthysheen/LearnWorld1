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
exports.getQuizzesByCourseAndTutor = exports.postQuiz = exports.deleteLesson = exports.getSingleCourse = exports.studentProfile = exports.enrolledStudents = exports.GetAllCategory = exports.refreshTokenCreation = exports.editLesson = exports.addNewLesson = exports.editCourse = exports.getAlltutorCourse = exports.addCourses = exports.tutorLogout = exports.editProfile = exports.tutorGoogleAuthentication = exports.tutorNewPassword = exports.verifyForgotOTP = exports.tutorForgotPassword = exports.tutorOtpExpiry = exports.tutorResendOtp = exports.verifyOtp = exports.tutorLogin = exports.tutorRegistration = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var generateToken_1 = require("../../Utlitis/generateToken");
require("dotenv/config");
var tutorModel_1 = __importDefault(require("../../models/tutorModel"));
var otpMail_1 = require("../../middleware/otpMail");
var Cloudinary_1 = require("../../Utlitis/Cloudinary");
var courseModel_1 = __importDefault(require("../../models/courseModel"));
var categoryModel_1 = __importDefault(require("../../models/categoryModel"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var studentModel_1 = __importDefault(require("../../models/studentModel"));
var orderModel_1 = __importDefault(require("../../models/orderModel"));
var questionModel_1 = __importDefault(require("../../models/questionModel"));
var appState = {
    otp: null,
    tutor: null,
};
var tutorRegistration = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tutorname, tutoremail, phone, password, tutorExist, tutor, mail, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, tutorname = _a.tutorname, tutoremail = _a.tutoremail, phone = _a.phone, password = _a.password;
                if (!tutorname || !tutoremail || !phone || !password) {
                    return [2 /*return*/, res.status(400).json({ message: "Fill all the fields" })];
                }
                return [4 /*yield*/, tutorModel_1.default.findOne({ tutoremail: tutoremail })];
            case 1:
                tutorExist = _b.sent();
                if (tutorExist) {
                    return [2 /*return*/, res.status(400).json({ message: "Tutor already exists" })];
                }
                tutor = {
                    tutorname: tutorname,
                    tutoremail: tutoremail,
                    phone: phone,
                    password: password,
                };
                appState.tutor = tutor;
                req.session.tutor = tutor;
                if (tutor) {
                    mail = (0, otpMail_1.sendMail)(tutor.tutoremail, res);
                    req.session.otp = mail;
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid user data" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: "Error occurred" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.tutorRegistration = tutorRegistration;
var verifyOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, data, addTutor, token, datas, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                otp = req.body.otp;
                console.log(otp, "---------------------------------------------------");
                if (!(otp == req.session.otp)) return [3 /*break*/, 2];
                data = req.session.tutor;
                return [4 /*yield*/, tutorModel_1.default.create(data)];
            case 1:
                addTutor = _a.sent();
                token = (0, generateToken_1.generateAccessToken)(addTutor._id);
                datas = {
                    _id: addTutor === null || addTutor === void 0 ? void 0 : addTutor._id,
                    tutorname: addTutor === null || addTutor === void 0 ? void 0 : addTutor.tutorname,
                    tutoremail: addTutor === null || addTutor === void 0 ? void 0 : addTutor.tutoremail,
                    phone: addTutor === null || addTutor === void 0 ? void 0 : addTutor.phone,
                    isBlocked: addTutor.isBlocked,
                    photo: "",
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
var tutorLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tutoremail, password, tutor, passwordMatch, accessToken, refreshToken, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, tutoremail = _a.tutoremail, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, tutorModel_1.default.findOne({ tutoremail: tutoremail }).where({
                        isBlocked: false,
                    })];
            case 2:
                tutor = _b.sent();
                if (!tutor) {
                    return [2 /*return*/, res.json({ status: false, message: "Tutor does not exist" })];
                }
                if ((tutor === null || tutor === void 0 ? void 0 : tutor.isBlocked) == true) {
                    return [2 /*return*/, res.json({ status: false, message: "Tutor is blocked" })];
                }
                if (!tutor) return [3 /*break*/, 4];
                return [4 /*yield*/, tutor.matchPassword(password)];
            case 3:
                passwordMatch = _b.sent();
                if (passwordMatch) {
                    accessToken = (0, generateToken_1.generateAccessToken)(tutor._id);
                    refreshToken = (0, generateToken_1.generateRefreshToken)(tutor._id);
                    req.session.accessToken = accessToken;
                    return [2 /*return*/, res.json({ status: true, response: tutor, token: refreshToken })];
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
exports.tutorLogin = tutorLogin;
var tutorResendOtp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, otp;
    return __generator(this, function (_a) {
        try {
            email = req.session.tutor.tutoremail;
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
exports.tutorResendOtp = tutorResendOtp;
var tutorOtpExpiry = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        req.session.otp = null;
        res
            .status(200)
            .json({ message: "OTP expired please click the resend button" });
        return [2 /*return*/];
    });
}); };
exports.tutorOtpExpiry = tutorOtpExpiry;
var tutorGoogleAuthentication = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var inComingEmailForVerification, name, userExists, us, user, response_1, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                inComingEmailForVerification = req.query.email;
                name = req.query.name;
                console.log(inComingEmailForVerification, "incoming email");
                return [4 /*yield*/, tutorModel_1.default.findOne({
                        tutoremail: inComingEmailForVerification,
                    })];
            case 1:
                userExists = _a.sent();
                if (!userExists) return [3 /*break*/, 2];
                res.send({ userExist: true, response: userExists });
                return [3 /*break*/, 4];
            case 2:
                us = {
                    tutoremail: inComingEmailForVerification,
                };
                user = new tutorModel_1.default({
                    tutorname: name,
                    tutoremail: inComingEmailForVerification,
                });
                return [4 /*yield*/, user.save()];
            case 3:
                response_1 = _a.sent();
                if (response_1) {
                    token = (0, generateToken_1.generateAccessToken)(response_1._id);
                    console.log("hiiiii");
                    // res.send({ userExist: true, token});
                    res.send({ userExist: true, token: token, response: response_1 });
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.tutorGoogleAuthentication = tutorGoogleAuthentication;
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
var tutorForgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tutoremail, tutorExists, otpReceived, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tutoremail = req.body.tutoremail;
                console.log(tutoremail);
                if (!req.session.tutor) {
                    req.session.tutor = {
                        tutorname: "",
                        tutoremail: "",
                        phone: "",
                        password: "",
                    };
                }
                req.session.tutor.tutoremail = tutoremail;
                return [4 /*yield*/, tutorModel_1.default.findOne({ tutoremail: tutoremail })];
            case 1:
                tutorExists = _a.sent();
                if (tutorExists) {
                    otpReceived = (0, otpMail_1.sendMail)(tutoremail, res);
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
exports.tutorForgotPassword = tutorForgotPassword;
var verifyForgotOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var otp;
    return __generator(this, function (_a) {
        try {
            otp = req.body.otp;
            // const email=req.session.tutor.tutoremail
            console.log(otp, ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
            console.log(req.session.otp, "+++++++++++++++");
            if (otp == req.session.otp) {
                // const tutor=await Tutor.findOne({ email });
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
exports.verifyForgotOTP = verifyForgotOTP;
var tutorNewPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newPassword, tutoremail, user, saltRounds, hash, err_1, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                newPassword = req.body.newPassword;
                console.log(newPassword, "----------------------------------");
                tutoremail = req.session.tutor.tutoremail;
                console.log(tutoremail, "............................");
                return [4 /*yield*/, tutorModel_1.default.findOne({ tutoremail: tutoremail })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send({
                            message: "Cannot find user with email: ".concat(tutoremail, "."),
                        })];
                }
                saltRounds = 10;
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, saltRounds)];
            case 2:
                hash = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, tutorModel_1.default.findOneAndUpdate({ tutoremail: tutoremail }, { password: hash })];
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
exports.tutorNewPassword = tutorNewPassword;
// interface customRequest extends Request {
//   file?: Express.Multer.File;
//   files?: Express.Multer.File[];
// }
// type Middleware = (
//   req: customRequest,
//   res: Response,
//   next: NextFunction
// ) => void;
var editProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tutorId, _a, tutorname, tutoremail, phone, file, buffer, imageUrl, updatedTutor, updatedTutor, error_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                tutorId = (_b = req.tutor) === null || _b === void 0 ? void 0 : _b._id;
                console.log(tutorId);
                console.log(req.body, '==body ');
                console.log(req.file, 'Filessss');
                _a = req.body, tutorname = _a.tutorname, tutoremail = _a.tutoremail, phone = _a.phone;
                if (!req.file) return [3 /*break*/, 3];
                file = req.file;
                buffer = file.buffer;
                return [4 /*yield*/, (0, Cloudinary_1.uploadCloud)(buffer, file.originalname)];
            case 1:
                imageUrl = _c.sent();
                console.log(imageUrl, 'URL ');
                return [4 /*yield*/, tutorModel_1.default.findByIdAndUpdate(tutorId, {
                        tutorname: tutorname,
                        tutoremail: tutoremail,
                        phone: phone,
                        photo: imageUrl,
                    }, { new: true })];
            case 2:
                updatedTutor = _c.sent();
                if (updatedTutor) {
                    res.status(200).json({ status: true, data: updatedTutor });
                }
                else {
                    res.status(404).json({ status: false, message: "Tutor not found" });
                }
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, tutorModel_1.default.findByIdAndUpdate(tutorId, {
                    tutorname: tutorname,
                    tutoremail: tutoremail,
                    phone: phone,
                }, { new: true })];
            case 4:
                updatedTutor = _c.sent();
                if (updatedTutor) {
                    res.status(200).json({ status: true, data: updatedTutor });
                }
                else {
                    res.status(404).json({ status: false, message: "Tutor not found" });
                }
                _c.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_6 = _c.sent();
                console.error("Error updating profile:", error_6);
                res.status(500).json({ status: false, message: "Failed to update profile" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.editProfile = editProfile;
var editCourse = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var courseId, _a, courseName, courseDescription, courseDuration, category, courseFee, tutor, cate, imageUrl, file, buffer, categoryObj, updatedCourseData, updatedCourse, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                courseId = req.params.id;
                console.log(courseId, "........................");
                _a = req.body, courseName = _a.courseName, courseDescription = _a.courseDescription, courseDuration = _a.courseDuration, category = _a.category, courseFee = _a.courseFee, tutor = _a.tutor;
                cate = JSON.parse(category);
                console.log(req.body, "=====================");
                imageUrl = "";
                if (!req.file) return [3 /*break*/, 2];
                file = req.file;
                buffer = file.buffer;
                return [4 /*yield*/, (0, Cloudinary_1.uploadCloud)(buffer, file.originalname)];
            case 1:
                imageUrl = _b.sent();
                console.log(imageUrl, 'URL ');
                _b.label = 2;
            case 2:
                console.log(cate);
                return [4 /*yield*/, categoryModel_1.default.findOne({ categoryname: cate.categoryname })];
            case 3:
                categoryObj = _b.sent();
                console.log(categoryObj, '***********');
                if (!categoryObj) {
                    return [2 /*return*/, res.status(400).json({ status: false, message: "Category not found" })];
                }
                updatedCourseData = {
                    courseName: courseName,
                    courseDescription: courseDescription,
                    courseDuration: courseDuration,
                    category: categoryObj._id,
                    courseFee: courseFee,
                };
                if (imageUrl) {
                    updatedCourseData.photo = imageUrl;
                }
                return [4 /*yield*/, courseModel_1.default.findByIdAndUpdate(courseId, updatedCourseData, { new: true })];
            case 4:
                updatedCourse = _b.sent();
                if (updatedCourse) {
                    console.log(req.body, "Body data");
                    res.status(200).json({ status: true, data: updatedCourse });
                }
                else {
                    res.status(404).json({ status: false, message: "Course not found" });
                }
                return [3 /*break*/, 6];
            case 5:
                error_7 = _b.sent();
                console.error("Error updating course:", error_7);
                res.status(500).json({ status: false, message: "Failed to update course" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.editCourse = editCourse;
var GetAllCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryDetails, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, categoryModel_1.default.find({ isDeleted: false }).exec()];
            case 1:
                categoryDetails = _a.sent();
                if (categoryDetails) {
                    return [2 /*return*/, res.status(200).json({
                            categoryDetails: categoryDetails
                        })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "Category does not exist" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.log(error_8);
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.GetAllCategory = GetAllCategory;
var addCourses = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, courseName, courseDescription, courseDuration, category, courseFee, tutor, file, buffer, imageUrl, categorys, course, response_2, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("I'm adding course");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                _a = req.body, courseName = _a.courseName, courseDescription = _a.courseDescription, courseDuration = _a.courseDuration, category = _a.category, courseFee = _a.courseFee, tutor = _a.tutor;
                if (!req.file) return [3 /*break*/, 7];
                file = req.file;
                buffer = file.buffer;
                return [4 /*yield*/, (0, Cloudinary_1.uploadCloud)(buffer, file.originalname)];
            case 2:
                imageUrl = _b.sent();
                if (!imageUrl) return [3 /*break*/, 6];
                console.log(req.body, "Body data");
                return [4 /*yield*/, categoryModel_1.default.findOne({ categoryname: category })];
            case 3:
                categorys = _b.sent();
                return [4 /*yield*/, courseModel_1.default.create({
                        courseName: courseName,
                        courseDescription: courseDescription,
                        category: categorys._id,
                        courseFee: courseFee,
                        courseDuration: courseDuration,
                        photo: imageUrl,
                        tutor: tutor
                    })];
            case 4:
                course = _b.sent();
                return [4 /*yield*/, course.save()];
            case 5:
                response_2 = _b.sent();
                if (response_2) {
                    console.log("sending req to frnd", response_2);
                    return [2 /*return*/, res.status(200).json({ status: true, data: response_2 })];
                }
                else {
                    res.status(400).json({ status: false, message: "Invalid Data Entry" });
                }
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(400).json({ status: false, message: "No file uploaded" });
                _b.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_9 = _b.sent();
                console.error(error_9);
                res.status(500).json({ status: false, message: "Internal Server Error" });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.addCourses = addCourses;
var getAlltutorCourse = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, courseDetails, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, courseModel_1.default.find({ tutor: id }).populate('category').exec()];
            case 1:
                courseDetails = _a.sent();
                console.log("Fetched Course Details:", courseDetails);
                if (courseDetails) {
                    res.status(200).json({
                        courseDetails: courseDetails,
                        message: "courseDetails"
                    });
                }
                else {
                    return [2 /*return*/, res.status(400).json({
                            error: "no course available "
                        })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.log(error_10);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAlltutorCourse = getAlltutorCourse;
var addNewLesson = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category, description, title, courseId, file, buffer, imageUrl, video, lessonAddedCourse, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                console.log(req.body, "---------------------------", req.file);
                _a = req.body, category = _a.category, description = _a.description, title = _a.title, courseId = _a.courseId;
                file = req === null || req === void 0 ? void 0 : req.file;
                buffer = file.buffer;
                console.log(file, "FILEE");
                return [4 /*yield*/, (0, Cloudinary_1.uploadCloud)(buffer, file.originalname)];
            case 1:
                imageUrl = _b.sent();
                if (!imageUrl) return [3 /*break*/, 3];
                video = imageUrl;
                return [4 /*yield*/, courseModel_1.default.findByIdAndUpdate(courseId, { $push: { lessons: { courseId: courseId, category: category, description: description, title: title, video: video } } }, { new: true })];
            case 2:
                lessonAddedCourse = _b.sent();
                console.log(lessonAddedCourse, "...///...//...//..///");
                if (lessonAddedCourse) {
                    return [2 /*return*/, res.status(200).json(lessonAddedCourse)];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ error: "Course not found" })];
                }
                _b.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_11 = _b.sent();
                res.status(500);
                throw error_11;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addNewLesson = addNewLesson;
var editLesson = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var lessonId, _a, courseId, category, description, title, file, videoUrl, _b, updateData, updatedCourse, error_12;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                lessonId = req.params.lessonId;
                console.log(lessonId, "...................");
                _a = req.body, courseId = _a.courseId, category = _a.category, description = _a.description, title = _a.title;
                console.log(req.body);
                file = req.file;
                if (!file) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, Cloudinary_1.uploadCloud)(file.buffer, file.originalname)];
            case 1:
                _b = _c.sent();
                return [3 /*break*/, 3];
            case 2:
                _b = undefined;
                _c.label = 3;
            case 3:
                videoUrl = _b;
                updateData = {};
                if (courseId)
                    updateData.courseId = courseId;
                if (category)
                    updateData.category = category;
                if (description)
                    updateData.description = description;
                if (title)
                    updateData.title = title;
                if (videoUrl)
                    updateData.video = videoUrl;
                return [4 /*yield*/, courseModel_1.default.findOneAndUpdate({ _id: courseId, "lessons._id": lessonId }, { $set: { "lessons.$": updateData } }, { new: true })];
            case 4:
                updatedCourse = _c.sent();
                if (updatedCourse) {
                    return [2 /*return*/, res.status(200).json({ data: updatedCourse })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ error: "Course not updated" })];
                }
                return [3 /*break*/, 6];
            case 5:
                error_12 = _c.sent();
                console.error(error_12);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.editLesson = editLesson;
var enrolledStudents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tutorId, studentData, students, i, id, studentDetails, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                console.log("hiiiiiiiiiiiiiiiiii");
                tutorId = req.params.tutorId;
                console.log(req.body);
                return [4 /*yield*/, orderModel_1.default.find({ tutorId: tutorId }).populate('studentId').populate('courseId').exec()];
            case 1:
                studentData = _a.sent();
                if (!studentData) return [3 /*break*/, 6];
                students = [];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < studentData.length)) return [3 /*break*/, 5];
                console.log(studentData[i], '------');
                id = studentData[i].studentId;
                return [4 /*yield*/, studentModel_1.default.findById(id)];
            case 3:
                studentDetails = _a.sent();
                students.push(studentDetails);
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                res.status(200).json({
                    studentData: studentData,
                    students: students
                });
                return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res.status(400).json({
                    message: "no users Found"
                })];
            case 7: return [3 /*break*/, 9];
            case 8:
                error_13 = _a.sent();
                console.log(error_13);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.enrolledStudents = enrolledStudents;
var studentProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, studentProfileDetails, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentId = req.params.studentId;
                console.log("Request received for studentId:", studentId);
                return [4 /*yield*/, studentModel_1.default.findById(studentId).exec()];
            case 1:
                studentProfileDetails = _a.sent();
                if (studentProfileDetails) {
                    res.status(200).json({
                        studentProfileDetails: studentProfileDetails,
                    });
                }
                else {
                    return [2 /*return*/, res.status(400).json({
                            message: "no users in this table",
                        })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.log(error_14);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.studentProfile = studentProfile;
var getSingleCourse = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courseId, courseDetail, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                courseId = req.params.courseId;
                console.log(courseId, "///////////////////////////");
                return [4 /*yield*/, courseModel_1.default.findById(courseId)];
            case 1:
                courseDetail = _a.sent();
                if (courseDetail) {
                    return [2 /*return*/, res.json({ status: true, courseDetail: courseDetail })];
                }
                else {
                    return [2 /*return*/, res.status(404).json({ status: false, message: 'Course not found' })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_15 = _a.sent();
                console.error(error_15);
                res.status(500).json({ message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleCourse = getSingleCourse;
var deleteLesson = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, courseId, lessonId_1, course, lessonIndex, error_16;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.params, courseId = _a.courseId, lessonId_1 = _a.lessonId;
                return [4 /*yield*/, courseModel_1.default.findById(courseId)];
            case 1:
                course = _b.sent();
                if (!course) {
                    return [2 /*return*/, res.status(404).json({ status: false, message: "Course not found" })];
                }
                lessonIndex = course.lessons.findIndex(function (lesson) { return lesson._id.toString() === String(lessonId_1); });
                if (lessonIndex === -1) {
                    return [2 /*return*/, res.status(404).json({ status: false, message: "Lesson not found" })];
                }
                course.lessons.splice(lessonIndex, 1);
                return [4 /*yield*/, course.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ status: true, message: "Lesson deleted successfully", data: course })];
            case 3:
                error_16 = _b.sent();
                console.error("Error deleting lesson:", error_16);
                return [2 /*return*/, res.status(500).json({ status: false, message: "An error occurred while deleting the lesson" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteLesson = deleteLesson;
var postQuiz = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var questions, isValidOption_1, isValidQuestion, savedQuestions, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                questions = req.body;
                if (!Array.isArray(questions) || questions.length === 0) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid data format: Expected an array of questions.' })];
                }
                isValidOption_1 = function (option) { return option && typeof option === 'object' && typeof option.optionText === 'string' && typeof option.isCorrect === 'boolean'; };
                isValidQuestion = function (question) {
                    return question &&
                        typeof question === 'object' &&
                        typeof question.courseId === 'string' &&
                        typeof question.tutorId === 'string' &&
                        typeof question.questionText === 'string' &&
                        Array.isArray(question.options) &&
                        question.options.every(isValidOption_1);
                };
                if (!questions.every(isValidQuestion)) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid data format: Each question should have courseId, tutorId, questionText, and options.' })];
                }
                return [4 /*yield*/, questionModel_1.default.insertMany(questions)];
            case 1:
                savedQuestions = _a.sent();
                res.status(201).json(savedQuestions);
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                console.error(error_17);
                return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.postQuiz = postQuiz;
var getQuizzesByCourseAndTutor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, courseId, tutorId, quizzes, error_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, courseId = _a.courseId, tutorId = _a.tutorId;
                return [4 /*yield*/, questionModel_1.default.find({ courseId: courseId, tutorId: tutorId })];
            case 1:
                quizzes = _b.sent();
                return [2 /*return*/, res.status(200).json(quizzes)];
            case 2:
                error_18 = _b.sent();
                console.error(error_18);
                return [2 /*return*/, res.status(500).json({ message: 'Internal Server Error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getQuizzesByCourseAndTutor = getQuizzesByCourseAndTutor;
var tutorLogout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.cookie("jwt", "", {
                httpOnly: true,
                expires: new Date(0),
            });
            return [2 /*return*/, res.status(200).json({ message: "Tutor Logged Out" })];
        }
        catch (error) {
            return [2 /*return*/, res.status(500).json({ error: "Internal Server Error" })];
        }
        return [2 /*return*/];
    });
}); };
exports.tutorLogout = tutorLogout;
