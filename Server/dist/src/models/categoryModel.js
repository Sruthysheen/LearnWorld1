"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var categorySchema = new mongoose_1.Schema({
    categoryname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
var Category = (0, mongoose_1.model)("category", categorySchema);
exports.default = Category;
