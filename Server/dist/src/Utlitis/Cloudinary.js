"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCloud = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
exports.default = cloudinary_1.v2;
const uploadCloud = async (buffer, filename) => {
    try {
        const base64String = buffer.toString('base64');
        let mimeType = '';
        if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
            mimeType = 'image/jpeg';
        }
        else if (filename.endsWith('.png')) {
            mimeType = 'image/png';
        }
        else if (filename.endsWith('.gif')) {
            mimeType = 'image/gif';
        }
        else if (filename.endsWith('.mp4')) {
            console.log('HI');
            mimeType = 'video/mp4';
        }
        else if (filename.endsWith('.avi')) {
            mimeType = 'video/x-msvideo';
        }
        else if (filename.endsWith('.mov')) {
            mimeType = 'video/quicktime';
        }
        else {
            console.error("Unsupported file format");
            return null;
        }
        console.log(mimeType, 'mimeType');
        console.log(filename.replace(/[\W_]+/g, "_"));
        const result = await cloudinary_1.v2.uploader.upload(`data:${mimeType};base64,${base64String}`, {
            folder: "Profile",
            public_id: filename.replace(/[\W_]+/g, "_"),
            resource_type: "auto"
        });
        console.log(result, "result");
        return result.secure_url;
    }
    catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};
exports.uploadCloud = uploadCloud;
