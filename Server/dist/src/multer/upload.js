"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.memoryStorage();
var fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('File type not supported!'));
    }
};
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter
});
exports.default = upload;
