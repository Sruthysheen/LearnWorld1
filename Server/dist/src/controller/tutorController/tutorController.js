"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizzesByCourseAndTutor = exports.postQuiz = exports.deleteLesson = exports.getSingleCourse = exports.studentProfile = exports.enrolledStudents = exports.GetAllCategory = exports.refreshTokenCreation = exports.editLesson = exports.addNewLesson = exports.editCourse = exports.getAlltutorCourse = exports.addCourses = exports.tutorLogout = exports.editProfile = exports.tutorGoogleAuthentication = exports.tutorNewPassword = exports.verifyForgotOTP = exports.tutorForgotPassword = exports.tutorOtpExpiry = exports.tutorResendOtp = exports.verifyOtp = exports.tutorLogin = exports.tutorRegistration = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../../Utlitis/generateToken");
require("dotenv/config");
const tutorModel_1 = __importDefault(require("../../models/tutorModel"));
const otpMail_1 = require("../../middleware/otpMail");
const Cloudinary_1 = require("../../Utlitis/Cloudinary");
const courseModel_1 = __importDefault(require("../../models/courseModel"));
const categoryModel_1 = __importDefault(require("../../models/categoryModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentModel_1 = __importDefault(require("../../models/studentModel"));
const orderModel_1 = __importDefault(require("../../models/orderModel"));
const questionModel_1 = __importDefault(require("../../models/questionModel"));
const appState = {
    otp: null,
    tutor: null,
};
const tutorRegistration = async (req, res) => {
    try {
        const { tutorname, tutoremail, phone, password } = req.body;
        if (!tutorname || !tutoremail || !phone || !password) {
            return res.status(400).json({ message: "Fill all the fields" });
        }
        const tutorExist = await tutorModel_1.default.findOne({ tutoremail });
        if (tutorExist) {
            return res.status(400).json({ message: "Tutor already exists" });
        }
        const tutor = {
            tutorname,
            tutoremail,
            phone,
            password,
        };
        appState.tutor = tutor;
        req.session.tutor = tutor;
        if (tutor) {
            const mail = (0, otpMail_1.sendMail)(tutor.tutoremail, res);
            req.session.otp = mail;
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Error occurred" });
    }
};
exports.tutorRegistration = tutorRegistration;
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log(otp, "---------------------------------------------------");
        if (otp == req.session.otp) {
            const data = req.session.tutor;
            const addTutor = await tutorModel_1.default.create(data);
            const token = (0, generateToken_1.generateAccessToken)(addTutor._id);
            const datas = {
                _id: addTutor?._id,
                tutorname: addTutor?.tutorname,
                tutoremail: addTutor?.tutoremail,
                phone: addTutor?.phone,
                isBlocked: addTutor.isBlocked,
                photo: "",
                token,
            };
            return res.status(200).json({
                response: datas,
                token: token
            });
        }
        else {
            res.status(500).json({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
};
exports.verifyOtp = verifyOtp;
const tutorLogin = async (req, res) => {
    const { tutoremail, password } = req.body;
    try {
        const tutor = await tutorModel_1.default.findOne({ tutoremail }).where({
            isBlocked: false,
        });
        if (!tutor) {
            return res.json({ status: false, message: "Tutor does not exist" });
        }
        if (tutor?.isBlocked == true) {
            return res.json({ status: false, message: "Tutor is blocked" });
        }
        if (tutor) {
            const passwordMatch = await tutor.matchPassword(password);
            if (passwordMatch) {
                const accessToken = (0, generateToken_1.generateAccessToken)(tutor._id);
                const refreshToken = (0, generateToken_1.generateRefreshToken)(tutor._id);
                req.session.accessToken = accessToken;
                return res.json({ status: true, response: tutor, token: refreshToken });
            }
            else {
                return res.json({ status: false, message: "Invalid email or password" });
            }
        }
        else {
            return res.json({ status: false, message: "Invalid email or password" });
        }
    }
    catch (error) {
        return res.json({ status: false, message: "Internal server error" });
    }
};
exports.tutorLogin = tutorLogin;
const tutorResendOtp = async (req, res) => {
    try {
        const email = req.session.tutor.tutoremail;
        const otp = (0, otpMail_1.sendMail)(email, res);
        req.session.otp = otp;
        return res.status(200).json({ message: "OTP resent successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.tutorResendOtp = tutorResendOtp;
const tutorOtpExpiry = async (req, res) => {
    req.session.otp = null;
    res
        .status(200)
        .json({ message: "OTP expired please click the resend button" });
};
exports.tutorOtpExpiry = tutorOtpExpiry;
const tutorGoogleAuthentication = async (req, res) => {
    const inComingEmailForVerification = req.query.email;
    const name = req.query.name;
    console.log(inComingEmailForVerification, "incoming email");
    const userExists = await tutorModel_1.default.findOne({
        tutoremail: inComingEmailForVerification,
    });
    if (userExists) {
        res.send({ userExist: true, response: userExists });
    }
    else {
        const us = {
            tutoremail: inComingEmailForVerification,
        };
        const user = new tutorModel_1.default({
            tutorname: name,
            tutoremail: inComingEmailForVerification,
        });
        const response = await user.save();
        if (response) {
            const token = (0, generateToken_1.generateAccessToken)(response._id);
            console.log("hiiiii");
            // res.send({ userExist: true, token});
            res.send({ userExist: true, token, response });
        }
    }
};
exports.tutorGoogleAuthentication = tutorGoogleAuthentication;
const refreshTokenCreation = async (req, res) => {
    try {
        const token = req.session.accessToken;
        console.log(token, "ACESSSSSS");
        if (!token)
            return res.status(403).json('token is not found');
        let payload;
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return { status: false, message: "error in jwt sign" };
            }
            else {
                payload = decode;
            }
        });
        if (!payload.student_id)
            return { status: false, message: "payload is not found" };
        const refreshToken = (0, generateToken_1.generateRefreshToken)(payload.student_id);
        console.log(refreshToken, 'REFRSH TOKEN ');
        res.status(200).json({ status: true, token: refreshToken });
    }
    catch (error) {
    }
};
exports.refreshTokenCreation = refreshTokenCreation;
const tutorForgotPassword = async (req, res) => {
    try {
        const { tutoremail } = req.body;
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
        const tutorExists = await tutorModel_1.default.findOne({ tutoremail });
        if (tutorExists) {
            const otpReceived = (0, otpMail_1.sendMail)(tutoremail, res);
            console.log(otpReceived, "...............................");
            req.session.otp = otpReceived;
            res.status(200).json({ message: "Email sent successfully" });
        }
        else {
            return res.status(400).json({ message: "No user exists" });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.tutorForgotPassword = tutorForgotPassword;
const verifyForgotOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        // const email=req.session.tutor.tutoremail
        console.log(otp, ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
        console.log(req.session.otp, "+++++++++++++++");
        if (otp == req.session.otp) {
            // const tutor=await Tutor.findOne({ email });
            return res.status(200).json({ message: "Success" });
        }
        else {
            return res.status(400).json({ message: "Please correct password" });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.verifyForgotOTP = verifyForgotOTP;
const tutorNewPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        console.log(newPassword, "----------------------------------");
        const tutoremail = req.session.tutor.tutoremail;
        console.log(tutoremail, "............................");
        const user = await tutorModel_1.default.findOne({ tutoremail: tutoremail });
        if (!user) {
            return res.status(404).send({
                message: `Cannot find user with email: ${tutoremail}.`,
            });
        }
        const saltRounds = 10;
        const hash = await bcryptjs_1.default.hash(newPassword, saltRounds);
        try {
            await tutorModel_1.default.findOneAndUpdate({ tutoremail: tutoremail }, { password: hash });
            res.status(200).send({
                message: "Successfully updated password.",
            });
        }
        catch (err) {
            res.status(500).send({
                message: "Error updating user information.",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "An error occurred.",
        });
    }
};
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
const editProfile = async (req, res, next) => {
    try {
        const tutorId = req.tutor?._id;
        console.log(tutorId);
        console.log(req.body, '==body ');
        console.log(req.file, 'Filessss');
        const { tutorname, tutoremail, phone } = req.body;
        if (req.file) {
            const file = req.file;
            const buffer = file.buffer;
            const imageUrl = await (0, Cloudinary_1.uploadCloud)(buffer, file.originalname);
            console.log(imageUrl, 'URL ');
            const updatedTutor = await tutorModel_1.default.findByIdAndUpdate(tutorId, {
                tutorname,
                tutoremail,
                phone,
                photo: imageUrl,
            }, { new: true });
            if (updatedTutor) {
                res.status(200).json({ status: true, data: updatedTutor });
            }
            else {
                res.status(404).json({ status: false, message: "Tutor not found" });
            }
        }
        else {
            const updatedTutor = await tutorModel_1.default.findByIdAndUpdate(tutorId, {
                tutorname,
                tutoremail,
                phone,
            }, { new: true });
            if (updatedTutor) {
                res.status(200).json({ status: true, data: updatedTutor });
            }
            else {
                res.status(404).json({ status: false, message: "Tutor not found" });
            }
        }
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ status: false, message: "Failed to update profile" });
    }
};
exports.editProfile = editProfile;
const editCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        console.log(courseId, "........................");
        const { courseName, courseDescription, courseDuration, category, courseFee, tutor } = req.body;
        const cate = JSON.parse(category);
        console.log(req.body, "=====================");
        let imageUrl = "";
        if (req.file) {
            const file = req.file;
            const buffer = file.buffer;
            imageUrl = await (0, Cloudinary_1.uploadCloud)(buffer, file.originalname);
            console.log(imageUrl, 'URL ');
        }
        console.log(cate);
        const categoryObj = await categoryModel_1.default.findOne({ categoryname: cate.categoryname });
        console.log(categoryObj, '***********');
        if (!categoryObj) {
            return res.status(400).json({ status: false, message: "Category not found" });
        }
        const updatedCourseData = {
            courseName,
            courseDescription,
            courseDuration,
            category: categoryObj._id,
            courseFee,
        };
        if (imageUrl) {
            updatedCourseData.photo = imageUrl;
        }
        const updatedCourse = await courseModel_1.default.findByIdAndUpdate(courseId, updatedCourseData, { new: true });
        if (updatedCourse) {
            console.log(req.body, "Body data");
            res.status(200).json({ status: true, data: updatedCourse });
        }
        else {
            res.status(404).json({ status: false, message: "Course not found" });
        }
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ status: false, message: "Failed to update course" });
    }
};
exports.editCourse = editCourse;
const GetAllCategory = async (req, res) => {
    try {
        const categoryDetails = await categoryModel_1.default.find({ isDeleted: false }).exec();
        if (categoryDetails) {
            return res.status(200).json({
                categoryDetails
            });
        }
        else {
            return res.status(400).json({ message: "Category does not exist" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.GetAllCategory = GetAllCategory;
const addCourses = async (req, res) => {
    console.log("I'm adding course");
    try {
        const { courseName, courseDescription, courseDuration, category, courseFee, tutor } = req.body;
        if (req.file) {
            const file = req.file;
            const buffer = file.buffer;
            const imageUrl = await (0, Cloudinary_1.uploadCloud)(buffer, file.originalname);
            if (imageUrl) {
                console.log(req.body, "Body data");
                const categorys = await categoryModel_1.default.findOne({ categoryname: category });
                const course = await courseModel_1.default.create({
                    courseName,
                    courseDescription,
                    category: categorys._id,
                    courseFee,
                    courseDuration,
                    photo: imageUrl,
                    tutor
                });
                const response = await course.save();
                if (response) {
                    console.log("sending req to frnd", response);
                    return res.status(200).json({ status: true, data: response });
                }
                else {
                    res.status(400).json({ status: false, message: "Invalid Data Entry" });
                }
            }
        }
        else {
            res.status(400).json({ status: false, message: "No file uploaded" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};
exports.addCourses = addCourses;
const getAlltutorCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const courseDetails = await courseModel_1.default.find({ tutor: id }).populate('category').exec();
        console.log("Fetched Course Details:", courseDetails);
        if (courseDetails) {
            res.status(200).json({
                courseDetails, message: "courseDetails"
            });
        }
        else {
            return res.status(400).json({
                error: "no course available "
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.getAlltutorCourse = getAlltutorCourse;
const addNewLesson = async (req, res) => {
    try {
        console.log(req.body, "---------------------------", req.file);
        const { category, description, title, courseId } = req.body;
        const file = req?.file;
        const buffer = file.buffer;
        console.log(file, "FILEE");
        const imageUrl = await (0, Cloudinary_1.uploadCloud)(buffer, file.originalname);
        if (imageUrl) {
            const video = imageUrl;
            const lessonAddedCourse = await courseModel_1.default.findByIdAndUpdate(courseId, { $push: { lessons: { courseId: courseId, category, description, title, video } } }, { new: true });
            console.log(lessonAddedCourse, "...///...//...//..///");
            if (lessonAddedCourse) {
                return res.status(200).json(lessonAddedCourse);
            }
            else {
                return res.status(400).json({ error: "Course not found" });
            }
        }
    }
    catch (error) {
        res.status(500);
        throw error;
    }
};
exports.addNewLesson = addNewLesson;
const editLesson = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        console.log(lessonId, "...................");
        const { courseId, category, description, title } = req.body;
        console.log(req.body);
        const file = req.file;
        const videoUrl = file ? await (0, Cloudinary_1.uploadCloud)(file.buffer, file.originalname) : undefined;
        // Construct lesson update data
        const updateData = {};
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
        const updatedCourse = await courseModel_1.default.findOneAndUpdate({ _id: courseId, "lessons._id": lessonId }, { $set: { "lessons.$": updateData } }, { new: true });
        if (updatedCourse) {
            return res.status(200).json({ data: updatedCourse });
        }
        else {
            return res.status(400).json({ error: "Course not updated" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.editLesson = editLesson;
const enrolledStudents = async (req, res) => {
    try {
        console.log("hiiiiiiiiiiiiiiiiii");
        const tutorId = req.params.tutorId;
        console.log(req.body);
        const studentData = await orderModel_1.default.find({ tutorId }).populate('studentId').populate('courseId').exec();
        if (studentData) {
            const students = [];
            for (let i = 0; i < studentData.length; i++) {
                console.log(studentData[i], '------');
                const id = studentData[i].studentId;
                const studentDetails = await studentModel_1.default.findById(id);
                students.push(studentDetails);
            }
            res.status(200).json({
                studentData,
                students
            });
        }
        else {
            return res.status(400).json({
                message: "no users Found"
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.enrolledStudents = enrolledStudents;
const studentProfile = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        console.log("Request received for studentId:", studentId);
        const studentProfileDetails = await studentModel_1.default.findById(studentId).exec();
        if (studentProfileDetails) {
            res.status(200).json({
                studentProfileDetails,
            });
        }
        else {
            return res.status(400).json({
                message: "no users in this table",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.studentProfile = studentProfile;
const getSingleCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        console.log(courseId, "///////////////////////////");
        const courseDetail = await courseModel_1.default.findById(courseId);
        if (courseDetail) {
            return res.json({ status: true, courseDetail });
        }
        else {
            return res.status(404).json({ status: false, message: 'Course not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getSingleCourse = getSingleCourse;
const deleteLesson = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const course = await courseModel_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: false, message: "Course not found" });
        }
        const lessonIndex = course.lessons.findIndex((lesson) => lesson._id.toString() === String(lessonId));
        if (lessonIndex === -1) {
            return res.status(404).json({ status: false, message: "Lesson not found" });
        }
        course.lessons.splice(lessonIndex, 1);
        await course.save();
        return res.status(200).json({ status: true, message: "Lesson deleted successfully", data: course });
    }
    catch (error) {
        console.error("Error deleting lesson:", error);
        return res.status(500).json({ status: false, message: "An error occurred while deleting the lesson" });
    }
};
exports.deleteLesson = deleteLesson;
const postQuiz = async (req, res) => {
    try {
        const questions = req.body;
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'Invalid data format: Expected an array of questions.' });
        }
        const isValidOption = (option) => option && typeof option === 'object' && typeof option.optionText === 'string' && typeof option.isCorrect === 'boolean';
        const isValidQuestion = (question) => question &&
            typeof question === 'object' &&
            typeof question.courseId === 'string' &&
            typeof question.tutorId === 'string' &&
            typeof question.questionText === 'string' &&
            Array.isArray(question.options) &&
            question.options.every(isValidOption);
        if (!questions.every(isValidQuestion)) {
            return res.status(400).json({ message: 'Invalid data format: Each question should have courseId, tutorId, questionText, and options.' });
        }
        const savedQuestions = await questionModel_1.default.insertMany(questions);
        res.status(201).json(savedQuestions);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.postQuiz = postQuiz;
const getQuizzesByCourseAndTutor = async (req, res) => {
    try {
        const { courseId, tutorId } = req.params;
        const quizzes = await questionModel_1.default.find({ courseId, tutorId });
        return res.status(200).json(quizzes);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getQuizzesByCourseAndTutor = getQuizzesByCourseAndTutor;
const tutorLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({ message: "Tutor Logged Out" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.tutorLogout = tutorLogout;
