"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var LessonProgressSchema = new mongoose_1.Schema({
    lessonId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
});
var StudentsProgressSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    progress: [LessonProgressSchema]
});
var courSchema = new mongoose_1.Schema({
    courseName: {
        type: String,
        required: true
    },
    courseDuration: {
        type: String,
        required: true
    },
    courseDescription: {
        type: String,
        required: true
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    courseFee: {
        type: Number,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isEnrolled: {
        type: Boolean,
        default: false,
    },
    isLessonCompleted: {
        type: Boolean,
        default: false,
    },
    photo: [{
            type: String
        }],
    tutor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tutor",
        required: true
    },
    students: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Student',
        }],
    lessons: [{
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            category: {
                type: String,
                required: true,
            },
            video: {
                type: String,
            },
            isActive: {
                type: Boolean,
                default: true,
            },
            courseId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true,
            },
        },],
    studentsProgress: [StudentsProgressSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
var Course = mongoose_1.default.model("courseModel", courSchema);
exports.default = Course;
