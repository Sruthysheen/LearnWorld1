"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProgress = exports.updatedProgress = exports.getAverageRatings = exports.fetchQuizzesByCourse = exports.getAllRatings = exports.getRating = exports.postReview = exports.updateWalletBalance = exports.getTransactions = exports.getBalance = exports.cancelCourse = exports.getTutorDetails = exports.getTutorList = exports.fetchCategory = exports.enrolledCourses = exports.refreshTokenCreation = exports.deleteCart = exports.stripePayment = exports.StudentEditProfile = exports.removeWishlistItem = exports.getWishlistItems = exports.addToWishlist = exports.removeCartItem = exports.getCartItems = exports.addToCart = exports.getAllCourses = exports.GoogleAuthentication = exports.otpExpiry = exports.studentLogout = exports.newPassword = exports.verifyForgotPassword = exports.forgotPassword = exports.resendOtp = exports.verifyOtp = exports.studentLogin = exports.studentRegistration = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../../Utlitis/generateToken");
require("dotenv/config");
const studentModel_1 = __importDefault(require("../../models/studentModel"));
const otpMail_1 = require("../../middleware/otpMail");
const courseModel_1 = __importDefault(require("../../models/courseModel"));
const categoryModel_1 = __importDefault(require("../../models/categoryModel"));
const cartModel_1 = __importDefault(require("../../models/cartModel"));
const wishlistModel_1 = __importDefault(require("../../models/wishlistModel"));
const Cloudinary_1 = require("../../Utlitis/Cloudinary");
const stripe_1 = __importDefault(require("stripe"));
const orderModel_1 = __importDefault(require("../../models/orderModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tutorModel_1 = __importDefault(require("../../models/tutorModel"));
const walletModel_1 = __importDefault(require("../../models/walletModel"));
const ratingModel_1 = __importDefault(require("../../models/ratingModel"));
const questionModel_1 = __importDefault(require("../../models/questionModel"));
const appState = {
    otp: null,
    student: null,
};
const studentRegistration = async (req, res) => {
    try {
        const { studentname, studentemail, phone, password } = req.body;
        console.log(req.body, "..................");
        if (!studentname || !studentemail || !phone || !password) {
            return res.status(400).json({ message: " Fill all the fields " });
        }
        const studentExist = await studentModel_1.default.findOne({ studentemail });
        if (studentExist) {
            return res.status(400).json({ message: "Student already exist" });
        }
        const student = {
            studentname,
            studentemail,
            phone,
            password,
        };
        appState.student = student;
        req.session.student = student;
        if (student) {
            const mail = (0, otpMail_1.sendMail)(student.studentemail, res);
            console.log(mail, '_______');
            req.session.otp = mail;
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Error occured" });
    }
};
exports.studentRegistration = studentRegistration;
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log(otp);
        if (otp == req.session.otp) {
            const data = req.session.student;
            const addStudent = await studentModel_1.default.create(data);
            const token = (0, generateToken_1.generateAccessToken)(addStudent._id);
            const datas = {
                _id: addStudent?._id,
                name: addStudent?.studentname,
                email: addStudent?.studentemail,
                phone: addStudent?.phone,
                isBlocked: addStudent.isBlocked,
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
const otpExpiry = async (req, res) => {
    console.log('here');
    req.session.otp = null;
    res.status(200).json({ message: "OTP expired please click the resend button " });
};
exports.otpExpiry = otpExpiry;
const studentLogin = async (req, res) => {
    const { studentemail, password } = req.body;
    try {
        const student = await studentModel_1.default.findOne({ studentemail }).where({ isBlocked: false });
        if (!student) {
            return res.json({ status: false, message: "Student is not existed" });
        }
        if (student?.isBlocked == true) {
            return res.json({ status: false, message: "Student is blocked" });
        }
        if (student) {
            const passwordMatch = await student.matchPassword(password);
            if (passwordMatch) {
                const accessToken = (0, generateToken_1.generateAccessToken)(student._id);
                const refreshToken = (0, generateToken_1.generateRefreshToken)(student._id);
                req.session.accessToken = accessToken;
                return res.json({ status: true, response: student, token: refreshToken });
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
exports.studentLogin = studentLogin;
const resendOtp = async (req, res) => {
    try {
        const email = req.session.student.studentemail;
        const otp = (0, otpMail_1.sendMail)(email, res);
        req.session.otp = otp;
        return res.status(200).json({ message: "OTP resent successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.resendOtp = resendOtp;
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
const GoogleAuthentication = async (req, res) => {
    const inComingEmailForVerification = req.query.email;
    console.log(inComingEmailForVerification, "incoming email");
    const userExists = await studentModel_1.default.findOne({
        studentemail: inComingEmailForVerification,
    });
    if (userExists) {
        res.send({ userExist: true });
    }
    else {
        const us = {
            studentemail: inComingEmailForVerification,
        };
        const user = new studentModel_1.default({
            studentemail: inComingEmailForVerification
        });
        const response = await user.save();
        if (response) {
            const token = (0, generateToken_1.generateAccessToken)(response._id);
            console.log("hiiiii");
            res.send({ userExist: true, token, response });
        }
    }
};
exports.GoogleAuthentication = GoogleAuthentication;
// const forgetData = {
//     otp: null as null | number,
// };
const forgotPassword = async (req, res) => {
    try {
        const { studentemail } = req.body;
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
        const studentExists = await studentModel_1.default.findOne({ studentemail });
        if (studentExists) {
            const otpReceived = (0, otpMail_1.sendMail)(studentemail, res);
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
exports.forgotPassword = forgotPassword;
const verifyForgotPassword = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log(otp, ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
        console.log(req.session.otp, "+++++++++++++++");
        if (otp == req.session.otp) {
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
exports.verifyForgotPassword = verifyForgotPassword;
const newPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        console.log(newPassword, "----------------------------------");
        const studentemail = req.session.student.studentemail;
        console.log(studentemail, "............................");
        const user = await studentModel_1.default.findOne({ studentemail: studentemail });
        if (!user) {
            return res.status(404).send({
                message: `Cannot find user with email: ${studentemail}.`,
            });
        }
        const saltRounds = 10;
        const hash = await bcryptjs_1.default.hash(newPassword, saltRounds);
        try {
            await studentModel_1.default.findOneAndUpdate({ studentemail: studentemail }, { password: hash });
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
exports.newPassword = newPassword;
const getAllCourses = async (req, res) => {
    try {
        const courseDetails = (await courseModel_1.default.find().sort({ createdAt: -1 }).populate('category').populate('tutor').exec());
        if (courseDetails.length > 0) {
            return res.status(200).json({ courseDetails });
        }
        else {
            return res.status(404).json({ message: "There are no courses" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllCourses = getAllCourses;
const addToCart = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const alreadyEnrolled = await orderModel_1.default.findOne({ courseId: courseId, studentId: studentId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "Student is already enrolled in this course" });
        }
        const cartItemExisted = await cartModel_1.default.findOne({ student: studentId, course: courseId });
        if (cartItemExisted) {
            return res.status(400).json({ message: "Course already exists in the cart" });
        }
        const newCartItem = new cartModel_1.default({ student: studentId, course: courseId });
        await newCartItem.save();
        return res.status(200).json({ message: "Course added to cart successfully" });
    }
    catch (error) {
        console.error("Error occurred while adding to cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.addToCart = addToCart;
const getCartItems = async (req, res) => {
    const studentId = req.params.studentId;
    console.log(studentId, "........................");
    try {
        const cartItems = await cartModel_1.default.find({ student: studentId }).populate("course");
        console.log(cartItems, "items");
        res.status(200).json(cartItems);
    }
    catch (error) {
        console.error("Error fetching cart Items", error);
        res.status(500).json({ error: "Internal server Error" });
    }
};
exports.getCartItems = getCartItems;
const removeCartItem = async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId;
        const removedItem = await cartModel_1.default.findByIdAndDelete({ _id: cartItemId });
        if (!removedItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }
        res.status(200).json({ message: "Course removed from the cart" });
    }
    catch (error) {
        console.error("Error removing course from cart", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.removeCartItem = removeCartItem;
const addToWishlist = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const itemExisted = await wishlistModel_1.default.findOne({ student: studentId, course: courseId });
        if (itemExisted) {
            return res.status(400).json({ message: "Course already existed in Wishlist" });
        }
        else {
            const newItem = new wishlistModel_1.default({ student: studentId, course: courseId });
            await newItem.save();
            return res.status(200).json({ message: "Course added to wishlist successfully" });
        }
    }
    catch (error) {
        console.error("Error Occur while Adding to wishlist", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.addToWishlist = addToWishlist;
const getWishlistItems = async (req, res) => {
    const studentId = req.params.studentId;
    console.log(studentId, "........................");
    try {
        const wishlistItems = await wishlistModel_1.default.find({ student: studentId }).populate("course");
        console.log(wishlistItems, "items");
        res.status(200).json(wishlistItems);
    }
    catch (error) {
        console.error("Error fetching cart Items", error);
        res.status(500).json({ error: "Internal server Error" });
    }
};
exports.getWishlistItems = getWishlistItems;
const removeWishlistItem = async (req, res) => {
    try {
        const wishlistItemId = req.params.wishlistItemId;
        const removedItem = await wishlistModel_1.default.findByIdAndDelete({ _id: wishlistItemId });
        if (!removedItem) {
            return res.status(404).json({ error: "Wishlist item not found" });
        }
        res.status(200).json({ message: "Course removed from the wishlist" });
    }
    catch (error) {
        console.error("Error removing course from wishlist", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.removeWishlistItem = removeWishlistItem;
const StudentEditProfile = async (req, res, next) => {
    try {
        const studentId = req.student?._id;
        console.log(studentId);
        console.log(req.body, '==body ');
        console.log(req.file, 'Filessss');
        const { studentname, studentemail, phone } = req.body;
        if (req.file) {
            const file = req.file;
            const buffer = file.buffer;
            const imageUrl = await (0, Cloudinary_1.uploadCloud)(buffer, file.originalname);
            console.log(imageUrl, 'URL ');
            const updatedStudent = await studentModel_1.default.findByIdAndUpdate(studentId, {
                studentname,
                studentemail,
                phone,
                photo: imageUrl,
            }, { new: true });
            if (updatedStudent) {
                res.status(200).json({ status: true, data: updatedStudent });
            }
            else {
                res.status(404).json({ status: false, message: "Tutor not found" });
            }
        }
        else {
            const updatedStudent = await studentModel_1.default.findByIdAndUpdate(studentId, {
                studentname,
                studentemail,
                phone,
            }, { new: true });
            if (updatedStudent) {
                res.status(200).json({ status: true, data: updatedStudent });
            }
            else {
                res.status(404).json({ status: false, message: "Student not found" });
            }
        }
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ status: false, message: "Failed to update profile" });
    }
};
exports.StudentEditProfile = StudentEditProfile;
require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_KEY;
console.log(stripeSecretKey, "Keyy");
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2024-04-10",
});
const stripePayment = async (req, res) => {
    try {
        console.log(req.body, "bodyyyyyyyyyyyyyyy");
        const line_items = req.body.cartItems.map((item) => {
            console.log(item, "ONE ITEM");
            return {
                price_data: {
                    currency: "INR",
                    product_data: {
                        name: item?.course[0]?.courseName,
                        images: item?.course[0]?.photo,
                        description: item?.course[0]?.courseDescription,
                        metadata: {
                            id: item._id,
                        },
                    },
                    unit_amount: item?.course[0]?.courseFee * 100,
                },
                quantity: 1,
            };
        });
        console.log(line_items, "LINEITEMSSSS");
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            billing_address_collection: "required",
            success_url: `${process.env.CLIENT_URL}/paymentSuccess`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
        });
        console.log(session.payment_status, "status", process.env.CLIENT_URL);
        if (session.payment_status === "unpaid") {
            const orderPromises = req.body.cartItems.map(async (cartItem) => {
                const studentId = cartItem?.student;
                const tutorId = cartItem?.course[0]?.tutor;
                const courseId = cartItem?.course[0]._id;
                const amount = cartItem?.course[0]?.courseFee;
                const order = await orderModel_1.default.create({
                    studentId: studentId,
                    tutorId: tutorId,
                    courseId: courseId,
                    amount: amount,
                    paymentMethod: 'Stripe',
                });
                await order.save();
                await courseModel_1.default.findByIdAndUpdate(courseId, {
                    $push: { students: studentId },
                });
                console.log("Order saved:", order);
                return order;
            });
            const orders = await Promise.all(orderPromises);
            res.json({
                status: true,
                url: session.url,
                orderIds: orders.map((order) => order._id),
                cart: req.body.cartItems
            });
        }
        else {
            res.status(400).json({ error: "Payment not completed yet." });
        }
    }
    catch (err) {
        console.error("Stripe Payment Error:", err);
        res.status(500).json({ error: "Payment error" });
    }
};
exports.stripePayment = stripePayment;
const deleteCart = async (req, res) => {
    try {
        const studentId = req.body.id;
        console.log(studentId, "iddddddddddddddddddddddddd");
        const clearCart = await cartModel_1.default.deleteMany({ student: studentId });
        if (clearCart.deletedCount > 0) {
            return res.json({ status: true });
        }
        else {
            return res.json({ status: false });
        }
    }
    catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.deleteCart = deleteCart;
const enrolledCourses = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        console.log(studentId, "............");
        const enrolledCourses = await orderModel_1.default.find({
            studentId: studentId
        })
            .populate("studentId")
            .populate("courseId")
            .populate("tutorId").sort({ createdAt: -1 });
        console.log(enrolledCourses, "................");
        return res.status(200).json(enrolledCourses);
    }
    catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.enrolledCourses = enrolledCourses;
const fetchCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await categoryModel_1.default.find({ _id: categoryId });
        console.log(category, ",,,,,,,,,,,,,,,,,,,,,,,,");
        if (category) {
            return res.status(200).json({ category, message: "category fetched" });
        }
        else {
            return res.status(400).json({ message: "category not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.fetchCategory = fetchCategory;
const getTutorList = async (req, res) => {
    try {
        const tutorDetails = await tutorModel_1.default.find().exec();
        if (tutorDetails) {
            res.status(200).json({
                tutorDetails,
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
exports.getTutorList = getTutorList;
const getTutorDetails = async (req, res) => {
    try {
        console.log(req.params, "req.params");
        const { id } = req.params;
        const tutorDetails = await tutorModel_1.default.findById(id);
        console.log(tutorDetails, "tutorDetails");
        if (tutorDetails) {
            res.status(200).json({
                tutorDetails,
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
exports.getTutorDetails = getTutorDetails;
const cancelCourse = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;
        console.log(req.body, "**********************************");
        const courseOrder = await orderModel_1.default.findOne({ courseId: courseId, studentId: studentId });
        if (!courseOrder) {
            return res.status(400).json({ message: "Course not found" });
        }
        const coursePrice = courseOrder.amount;
        const courseCancelled = await orderModel_1.default.findOneAndDelete({ courseId: courseId, studentId: studentId });
        console.log(courseCancelled);
        if (courseCancelled) {
            let studentWallet = await walletModel_1.default.findOne({ studentId: studentId });
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
                            courseId: courseId,
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
                const enrollment = studentWallet.enrollments.find(enrollment => enrollment.courseId.toString() === courseId.toString());
                if (enrollment) {
                    enrollment.refunded = true;
                }
                else {
                    studentWallet.enrollments.push({
                        courseId: courseId,
                        date: new Date(),
                        refunded: true,
                    });
                }
            }
            await studentWallet.save();
            return res.status(200).json({ message: "Course cancelled and amount refunded to wallet" });
        }
        else {
            return res.status(400).json({ message: "Not able to cancel the course" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
};
exports.cancelCourse = cancelCourse;
const getBalance = async (req, res) => {
    try {
        const { studentId } = req.params;
        console.log(studentId, "..............................");
        const wallet = await walletModel_1.default.findOne({ studentId });
        if (wallet) {
            return res.status(200).json(wallet.balance);
        }
        else {
            return res.status(400).json({ message: "Balance is not available" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getBalance = getBalance;
const getTransactions = async (req, res) => {
    try {
        const { studentId } = req.params;
        console.log(studentId, "..............................");
        const wallet = await walletModel_1.default.findOne({ studentId });
        if (wallet && wallet.transactions.length > 0) {
            return res.status(200).json(wallet.transactions);
        }
        else {
            return res.status(404).json({ message: "Transactions are not available" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getTransactions = getTransactions;
const updateWalletBalance = async (req, res) => {
    try {
        const { studentId, amount, cartItems } = req.body;
        const wallet = await walletModel_1.default.findOne({ studentId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        if (wallet.balance + amount < 0) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        wallet.balance += amount;
        wallet.transactions.push({
            type: amount < 0 ? 'debit' : 'credit',
            amount: Math.abs(amount),
            date: new Date(),
        });
        const orders = cartItems.map((cartItem) => ({
            studentId: studentId,
            tutorId: cartItem.course[0]?.tutor,
            courseId: cartItem.course[0]._id,
            amount: cartItem.course[0]?.courseFee,
            status: 'success',
            paymentMethod: 'Wallet',
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        await orderModel_1.default.insertMany(orders);
        await wallet.save();
        res.status(200).json({ message: 'Wallet balance updated and orders created successfully', walletBalance: wallet.balance });
    }
    catch (error) {
        console.error("Error updating wallet balance and creating orders:", error);
        res.status(500).json({ message: 'Error updating wallet balance and creating orders' });
    }
};
exports.updateWalletBalance = updateWalletBalance;
const postReview = async (req, res) => {
    try {
        const { review, rating, courseId, studentId } = req.body;
        console.log(req.body);
        let submittedReview = await ratingModel_1.default.findOne({ courseId: courseId, studentId: studentId });
        if (!submittedReview) {
            submittedReview = new ratingModel_1.default({
                courseId: courseId,
                studentId: studentId,
                rating: rating,
                review: review
            });
            await submittedReview.save();
        }
        else {
            submittedReview.review = review;
            submittedReview.rating = rating;
            await submittedReview.save();
        }
        res.status(200).json({ message: "Review submitted successfully", rating: submittedReview });
    }
    catch (error) {
        console.error("Error while submitting review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.postReview = postReview;
const getRating = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const studentRating = await ratingModel_1.default.find({ courseId, studentId }).populate('studentId');
        if (!studentRating) {
            return res.status(400).json({ message: "Rating details not found" });
        }
        else {
            return res.status(200).json({ message: "My rating details", data: studentRating });
        }
    }
    catch (error) {
        console.error("Error fetching rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getRating = getRating;
const getAllRatings = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        const allRatings = await ratingModel_1.default.find({ courseId }).populate('studentId');
        if (allRatings.length > 0) {
            return res.status(200).json({ message: "Ratings are fetched", allRatings });
        }
        else {
            return res.status(404).json({ message: "There are no ratings for this course" });
        }
    }
    catch (error) {
        console.error("Error while fetching ratings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllRatings = getAllRatings;
const fetchQuizzesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const questions = await questionModel_1.default.find({ courseId });
        return res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error while fetching ratings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.fetchQuizzesByCourse = fetchQuizzesByCourse;
const getAverageRatings = async (req, res) => {
    try {
        const averageRatings = await ratingModel_1.default.aggregate([
            {
                $group: {
                    _id: "$courseId",
                    averageRating: { $avg: "$rating" },
                    ratingCount: { $sum: 1 }
                }
            }
        ]);
        if (averageRatings.length > 0) {
            return res.status(200).json({ averageRatings });
        }
        else {
            return res.status(404).json({ message: "No ratings found" });
        }
    }
    catch (error) {
        console.error("Error fetching average ratings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAverageRatings = getAverageRatings;
const updatedProgress = async (req, res) => {
    const { courseId, studentId, lessonId } = req.body;
    try {
        const course = await courseModel_1.default.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        const studentProgress = course.studentsProgress.find(sp => sp.studentId.toString() === studentId);
        if (studentProgress) {
            const lessonProgress = studentProgress.progress.find(lp => lp.lessonId.toString() === lessonId);
            if (lessonProgress) {
                lessonProgress.isCompleted = true;
            }
            else {
                studentProgress.progress.push({ lessonId, isCompleted: true });
            }
        }
        else {
            course.studentsProgress.push({
                studentId,
                progress: [{ lessonId, isCompleted: true }]
            });
        }
        await course.save();
        res.status(200).send({ message: 'Progress updated successfully' });
    }
    catch (error) {
        res.status(500).send({ message: 'Failed to update progress', error });
    }
};
exports.updatedProgress = updatedProgress;
const fetchProgress = async (req, res) => {
    const { courseId, studentId } = req.params;
    try {
        const course = await courseModel_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        const studentProgress = course.studentsProgress.find(sp => sp.studentId.toString() === studentId);
        if (!studentProgress) {
            return res.json({ status: true, data: { watchedLessons: [] } });
        }
        const watchedLessons = studentProgress.progress.filter(lesson => lesson.isCompleted);
        res.json({ status: true, data: { watchedLessons } });
    }
    catch (error) {
        console.error('Error fetching student progress:', error);
        res.status(500).send('Server Error');
    }
};
exports.fetchProgress = fetchProgress;
const studentLogout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.studentLogout = studentLogout;
