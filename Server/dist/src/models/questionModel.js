"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var optionSchema = new mongoose_1.Schema({
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
});
var questionSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "courseModel",
        required: true,
    },
    tutorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tutor",
        required: true,
    },
    questionText: { type: String, required: true },
    options: [optionSchema],
});
var Question = (0, mongoose_1.model)("Question", questionSchema);
exports.default = Question;
