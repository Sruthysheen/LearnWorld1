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
exports.getAllOrders = exports.calculateTotalRevenue = exports.getAllCourses = exports.refreshTokenCreation = exports.deleteCategory = exports.editCategory = exports.getCategoryById = exports.listAllCategory = exports.addAdminCategory = exports.unblockTutor = exports.blockTutor = exports.listAllTutors = exports.unblockStudent = exports.blockStudent = exports.listAllStudents = exports.logoutAdmin = exports.loginAdmin = void 0;
var adminModel_1 = __importDefault(require("../../models/adminModel"));
var generateToken_1 = require("../../Utlitis/generateToken");
var studentModel_1 = __importDefault(require("../../models/studentModel"));
var tutorModel_1 = __importDefault(require("../../models/tutorModel"));
var categoryModel_1 = __importDefault(require("../../models/categoryModel"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var courseModel_1 = __importDefault(require("../../models/courseModel"));
var orderModel_1 = __importDefault(require("../../models/orderModel"));
var loginAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, adminemail, password, admin, idString, accessToken, refreshToken, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, adminemail = _a.adminemail, password = _a.password;
                return [4 /*yield*/, adminModel_1.default.findOne({ adminemail: adminemail })];
            case 1:
                admin = _b.sent();
                if (admin)
                    if (admin.password === password) {
                        idString = admin._id.toString();
                        accessToken = (0, generateToken_1.generateAccessToken)(idString);
                        refreshToken = (0, generateToken_1.generateRefreshToken)(idString);
                        req.session.accessToken = accessToken;
                        return [2 /*return*/, res.json({ status: true, id: idString, adminemail: adminemail, token: refreshToken, })];
                    }
                    else {
                        return [2 /*return*/, res.json({ status: false, message: "Invalid email or password" })];
                    }
                else {
                    return [2 /*return*/, res.json({ status: false, message: "Invalid email or password" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                return [2 /*return*/, res.json({ status: false, message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.loginAdmin = loginAdmin;
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
var logoutAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.cookie("jwtAdmin", "", {
            httpOnly: true,
            expires: new Date(),
        });
        res.status(200).json({ message: "Admin Logged Out" });
        return [2 /*return*/];
    });
}); };
exports.logoutAdmin = logoutAdmin;
var listAllStudents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentDetails, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("headers", req.headers);
                return [4 /*yield*/, studentModel_1.default.find().exec()];
            case 1:
                studentDetails = _a.sent();
                if (studentDetails) {
                    res.status(200).json({
                        studentDetails: studentDetails,
                    });
                }
                else {
                    return [2 /*return*/, res.status(400).json({
                            message: "no users in this table",
                        })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.listAllStudents = listAllStudents;
var blockStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                console.log(id, "id");
                return [4 /*yield*/, studentModel_1.default.findById(id)];
            case 1:
                user = _a.sent();
                console.log(user, "user");
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: "User not Found" })];
                }
                user.isBlocked = true;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "User Blocked Successfully" })];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                return [2 /*return*/, res.status(500).json({ message: "Server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.blockStudent = blockStudent;
var unblockStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, studentModel_1.default.findById(id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: "User not Found" })];
                }
                user.isBlocked = false;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "User UnBlocked SuccessFully" })];
            case 3:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, res.status(400).json({ message: "Server Error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.unblockStudent = unblockStudent;
var listAllTutors = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tutorDetails, error_5;
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
                error_5 = _a.sent();
                console.log(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.listAllTutors = listAllTutors;
var blockTutor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, tutor, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                console.log(id, "id");
                return [4 /*yield*/, tutorModel_1.default.findById(id)];
            case 1:
                tutor = _a.sent();
                console.log(tutor, "tutor");
                if (!tutor) {
                    return [2 /*return*/, res.status(400).json({ message: "Tutor not Found" })];
                }
                tutor.isBlocked = true;
                return [4 /*yield*/, tutor.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Tutor Blocked Successfully" })];
            case 3:
                error_6 = _a.sent();
                console.log(error_6);
                return [2 /*return*/, res.status(500).json({ message: "Server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.blockTutor = blockTutor;
var unblockTutor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, tutor, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, tutorModel_1.default.findById(id)];
            case 1:
                tutor = _a.sent();
                if (!tutor) {
                    return [2 /*return*/, res.status(400).json({ message: "Tutor not Found" })];
                }
                tutor.isBlocked = false;
                return [4 /*yield*/, tutor.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Tutor UnBlocked SuccessFully" })];
            case 3:
                error_7 = _a.sent();
                console.log(error_7);
                return [2 /*return*/, res.status(400).json({ message: "Server Error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.unblockTutor = unblockTutor;
var addAdminCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, categoryname, description, categoryExist, newCategory, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, categoryname = _a.categoryname, description = _a.description;
                console.log(req.body);
                return [4 /*yield*/, categoryModel_1.default.findOne({
                        categoryname: { $regex: new RegExp("^".concat(categoryname, "$"), 'i') }
                    })];
            case 1:
                categoryExist = _b.sent();
                console.log(categoryExist);
                if (categoryExist) {
                    return [2 /*return*/, res.json({ status: false, message: "Category already exists" })];
                }
                return [4 /*yield*/, categoryModel_1.default.create({
                        categoryname: categoryname,
                        description: description
                    })];
            case 2:
                newCategory = _b.sent();
                if (newCategory) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            categoryname: categoryname,
                            description: description,
                            message: "Category added successfully"
                        })];
                }
                else {
                    return [2 /*return*/, res.json({ status: false, message: "Invalid category data" })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_8 = _b.sent();
                res.json({ status: false, message: "Server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addAdminCategory = addAdminCategory;
var listAllCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryDetails, error_9;
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
                error_9 = _a.sent();
                console.log(error_9);
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
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
var getCategoryById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, categoryDetails, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, categoryModel_1.default.findById(id).exec()];
            case 2:
                categoryDetails = _a.sent();
                if (categoryDetails) {
                    return [2 /*return*/, res.status(200).json({ categoryDetails: categoryDetails, message: "Category found successfully" })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ massage: "message not found" })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_10 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryById = getCategoryById;
var editCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, categoryname, description, id, category, existingCategory, updatedCategory, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log(req.body);
                _a = req.body, categoryname = _a.categoryname, description = _a.description, id = _a.id;
                return [4 /*yield*/, categoryModel_1.default.findById(id)];
            case 1:
                category = _b.sent();
                console.log(category, "----------------------");
                if (!category) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid category" })];
                }
                if (!(category.categoryname !== categoryname)) return [3 /*break*/, 3];
                return [4 /*yield*/, categoryModel_1.default.findOne({
                        categoryname: { $regex: new RegExp("^".concat(categoryname, "$"), 'i') },
                        _id: { $ne: id }
                    })];
            case 2:
                existingCategory = _b.sent();
                if (existingCategory) {
                    return [2 /*return*/, res.status(400).json({ message: "Category with the same name already exists" })];
                }
                _b.label = 3;
            case 3:
                category.categoryname = categoryname;
                category.description = description;
                return [4 /*yield*/, category.save()];
            case 4:
                updatedCategory = _b.sent();
                console.log(updatedCategory, ".....................");
                if (updatedCategory) {
                    return [2 /*return*/, res.status(200).json({ message: "Category updated successfully" })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ error: "Failed to update category" })];
                }
                return [3 /*break*/, 6];
            case 5:
                error_11 = _b.sent();
                console.error(error_11);
                return [2 /*return*/, res.status(500).json({ error: "Internal Server Error" })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.editCategory = editCategory;
var deleteCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, item, updatedItem, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("deletye Category");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                id = req.params.id;
                return [4 /*yield*/, categoryModel_1.default.findOne({ _id: id })];
            case 2:
                item = _a.sent();
                if (!item) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ success: false, message: "Category not found" })];
                }
                if (!(item && "isDeleted" in item)) return [3 /*break*/, 4];
                item.isDeleted = true;
                return [4 /*yield*/, item.save()];
            case 3:
                updatedItem = _a.sent();
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
                return [3 /*break*/, 5];
            case 4:
                res
                    .status(500)
                    .json({
                    success: false,
                    message: "Category deletion failed - Property not found",
                });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_12 = _a.sent();
                console.error("Error deleting category:", error_12);
                res.status(500).json({ success: false, message: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
var getAllCourses = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courseDetails, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, courseModel_1.default.find({})];
            case 1:
                courseDetails = _a.sent();
                if (courseDetails.length > 0) {
                    return [2 /*return*/, res.status(200).json({ success: true, courseDetails: courseDetails })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'No courses found' })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.error(error_13);
                return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllCourses = getAllCourses;
var calculateTotalRevenue = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var totalRevenueResult, totalRevenue, monthlyRevenueResult, monthlyRevenue, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, orderModel_1.default.aggregate([
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
                    ])];
            case 1:
                totalRevenueResult = _a.sent();
                totalRevenue = totalRevenueResult && totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
                return [4 /*yield*/, orderModel_1.default.aggregate([
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
                    ])];
            case 2:
                monthlyRevenueResult = _a.sent();
                monthlyRevenue = monthlyRevenueResult.map(function (item) { return ({
                    year: item._id.year,
                    month: item._id.month,
                    revenue: item.monthlyRevenue
                }); });
                console.log("Total Revenue: $".concat(totalRevenue));
                console.log('Monthly Revenue:', monthlyRevenue);
                return [2 /*return*/, res.status(200).json({ totalRevenue: totalRevenue, monthlyRevenue: monthlyRevenue })];
            case 3:
                error_14 = _a.sent();
                console.error('Error calculating revenues:', error_14);
                return [2 /*return*/, res.status(500).json({ message: 'Internal server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.calculateTotalRevenue = calculateTotalRevenue;
var getAllOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, orderModel_1.default.find({}).populate('courseId').populate('studentId').populate('tutorId')];
            case 1:
                orders = _a.sent();
                if (orders) {
                    return [2 /*return*/, res.status(200).json({ orders: orders })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "No orders found" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_15 = _a.sent();
                console.error('Error getting orders:', error_15);
                return [2 /*return*/, res.status(500).json({ message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllOrders = getAllOrders;
