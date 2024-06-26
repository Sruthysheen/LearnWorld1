"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.calculateTotalRevenue = exports.getAllCourses = exports.refreshTokenCreation = exports.deleteCategory = exports.editCategory = exports.getCategoryById = exports.listAllCategory = exports.addAdminCategory = exports.unblockTutor = exports.blockTutor = exports.listAllTutors = exports.unblockStudent = exports.blockStudent = exports.listAllStudents = exports.logoutAdmin = exports.loginAdmin = void 0;
const adminModel_1 = __importDefault(require("../../models/adminModel"));
const generateToken_1 = require("../../Utlitis/generateToken");
const studentModel_1 = __importDefault(require("../../models/studentModel"));
const tutorModel_1 = __importDefault(require("../../models/tutorModel"));
const categoryModel_1 = __importDefault(require("../../models/categoryModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const courseModel_1 = __importDefault(require("../../models/courseModel"));
const orderModel_1 = __importDefault(require("../../models/orderModel"));
const loginAdmin = async (req, res) => {
    try {
        const { adminemail, password } = req.body;
        // Assuming you have a MongoDB collection called "admins"
        const admin = await adminModel_1.default.findOne({ adminemail });
        if (admin)
            if (admin.password === password) {
                const idString = admin._id.toString();
                const accessToken = (0, generateToken_1.generateAccessToken)(idString);
                const refreshToken = (0, generateToken_1.generateRefreshToken)(idString);
                req.session.accessToken = accessToken;
                return res.json({ status: true, id: idString, adminemail, token: refreshToken,
                });
            }
            else {
                return res.json({ status: false, message: "Invalid email or password" });
            }
        else {
            return res.json({ status: false, message: "Invalid email or password" });
        }
    }
    catch (error) {
        return res.json({ status: false, message: "Internal Server Error" });
    }
};
exports.loginAdmin = loginAdmin;
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
const logoutAdmin = async (req, res) => {
    res.cookie("jwtAdmin", "", {
        httpOnly: true,
        expires: new Date(),
    });
    res.status(200).json({ message: "Admin Logged Out" });
};
exports.logoutAdmin = logoutAdmin;
const listAllStudents = async (req, res) => {
    try {
        console.log("headers", req.headers);
        const studentDetails = await studentModel_1.default.find().exec();
        if (studentDetails) {
            res.status(200).json({
                studentDetails,
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
exports.listAllStudents = listAllStudents;
const blockStudent = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id, "id");
        const user = await studentModel_1.default.findById(id);
        console.log(user, "user");
        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        }
        user.isBlocked = true;
        await user.save();
        return res.status(200).json({ message: "User Blocked Successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.blockStudent = blockStudent;
const unblockStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await studentModel_1.default.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        }
        user.isBlocked = false;
        await user.save();
        return res.status(200).json({ message: "User UnBlocked SuccessFully" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Server Error" });
    }
};
exports.unblockStudent = unblockStudent;
const listAllTutors = async (req, res) => {
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
exports.listAllTutors = listAllTutors;
const blockTutor = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id, "id");
        const tutor = await tutorModel_1.default.findById(id);
        console.log(tutor, "tutor");
        if (!tutor) {
            return res.status(400).json({ message: "Tutor not Found" });
        }
        tutor.isBlocked = true;
        await tutor.save();
        return res.status(200).json({ message: "Tutor Blocked Successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.blockTutor = blockTutor;
const unblockTutor = async (req, res) => {
    try {
        const { id } = req.params;
        const tutor = await tutorModel_1.default.findById(id);
        if (!tutor) {
            return res.status(400).json({ message: "Tutor not Found" });
        }
        tutor.isBlocked = false;
        await tutor.save();
        return res.status(200).json({ message: "Tutor UnBlocked SuccessFully" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Server Error" });
    }
};
exports.unblockTutor = unblockTutor;
const addAdminCategory = async (req, res) => {
    try {
        const { categoryname, description } = req.body;
        console.log(req.body);
        const categoryExist = await categoryModel_1.default.findOne({
            categoryname: { $regex: new RegExp(`^${categoryname}$`, 'i') }
        });
        console.log(categoryExist);
        if (categoryExist) {
            return res.json({ status: false, message: "Category already exists" });
        }
        const newCategory = await categoryModel_1.default.create({
            categoryname: categoryname,
            description: description
        });
        if (newCategory) {
            return res.status(200).json({
                status: true,
                categoryname,
                description,
                message: "Category added successfully"
            });
        }
        else {
            return res.json({ status: false, message: "Invalid category data" });
        }
    }
    catch (error) {
        res.json({ status: false, message: "Server error" });
    }
};
exports.addAdminCategory = addAdminCategory;
const listAllCategory = async (req, res) => {
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
exports.listAllCategory = listAllCategory;
// const listAllCategoryForView = async (req: Request, res: Response) => {
//   try {
//     const categoryDetails = await Category.find({ isDeleted: false }).exec();
//     if (categoryDetails) {
//       return res.status(200).json({
//         data: categoryDetails 
//       });
//     } else {
//       return res.status(400).json({ message: "Category does not exist" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const getCategoryById = async (req, res) => {
    const id = req.params.id;
    try {
        const categoryDetails = await categoryModel_1.default.findById(id).exec();
        if (categoryDetails) {
            return res.status(200).json({ categoryDetails, message: "Category found successfully" });
        }
        else {
            return res.status(400).json({ massage: "message not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getCategoryById = getCategoryById;
const editCategory = async (req, res) => {
    try {
        console.log(req.body);
        const { categoryname, description, id } = req.body;
        const category = await categoryModel_1.default.findById(id);
        console.log(category, "----------------------");
        if (!category) {
            return res.status(400).json({ error: "Invalid category" });
        }
        if (category.categoryname !== categoryname) {
            const existingCategory = await categoryModel_1.default.findOne({
                categoryname: { $regex: new RegExp(`^${categoryname}$`, 'i') },
                _id: { $ne: id }
            });
            if (existingCategory) {
                return res.status(400).json({ message: "Category with the same name already exists" });
            }
        }
        category.categoryname = categoryname;
        category.description = description;
        const updatedCategory = await category.save();
        console.log(updatedCategory, ".....................");
        if (updatedCategory) {
            return res.status(200).json({ message: "Category updated successfully" });
        }
        else {
            return res.status(400).json({ error: "Failed to update category" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.editCategory = editCategory;
const deleteCategory = async (req, res) => {
    console.log("deletye Category");
    try {
        const { id } = req.params;
        const item = await categoryModel_1.default.findOne({ _id: id });
        if (!item) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        if (item && "isDeleted" in item) {
            item.isDeleted = true;
            const updatedItem = await item.save();
            if (updatedItem) {
                res
                    .status(200)
                    .json({ success: true, message: "Category Deleted Successfully" });
            }
            else {
                res
                    .status(500)
                    .json({ success: false, message: "Category deletion failed" });
            }
        }
        else {
            res
                .status(500)
                .json({
                success: false,
                message: "Category deletion failed - Property not found",
            });
        }
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.deleteCategory = deleteCategory;
const getAllCourses = async (req, res) => {
    try {
        const courseDetails = await courseModel_1.default.find({});
        if (courseDetails.length > 0) {
            return res.status(200).json({ success: true, courseDetails });
        }
        else {
            return res.status(400).json({ success: false, message: 'No courses found' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getAllCourses = getAllCourses;
const calculateTotalRevenue = async (req, res) => {
    try {
        const totalRevenueResult = await orderModel_1.default.aggregate([
            {
                $match: {
                    status: 'success'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' }
                }
            }
        ]);
        const totalRevenue = totalRevenueResult && totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
        const monthlyRevenueResult = await orderModel_1.default.aggregate([
            {
                $match: {
                    status: 'success'
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    monthlyRevenue: { $sum: '$amount' }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);
        const monthlyRevenue = monthlyRevenueResult.map(item => ({
            year: item._id.year,
            month: item._id.month,
            revenue: item.monthlyRevenue
        }));
        console.log(`Total Revenue: $${totalRevenue}`);
        console.log('Monthly Revenue:', monthlyRevenue);
        return res.status(200).json({ totalRevenue, monthlyRevenue });
    }
    catch (error) {
        console.error('Error calculating revenues:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.calculateTotalRevenue = calculateTotalRevenue;
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel_1.default.find({}).populate('courseId').populate('studentId').populate('tutorId');
        if (orders) {
            return res.status(200).json({ orders });
        }
        else {
            return res.status(400).json({ message: "No orders found" });
        }
    }
    catch (error) {
        console.error('Error getting orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllOrders = getAllOrders;
