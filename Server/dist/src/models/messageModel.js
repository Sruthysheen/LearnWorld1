"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var messageSchema = new mongoose_1.default.Schema({
    conversationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'chatModel',
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    message: {
        type: String,
        trim: true,
        required: true,
    },
    media: {
        url: {
            type: String,
        },
        type: {
            type: String,
            enum: ["image", "video", ""],
        }
    }
}, {
    timestamps: true,
});
var MessageModel = mongoose_1.default.model('message', messageSchema);
exports.default = MessageModel;
