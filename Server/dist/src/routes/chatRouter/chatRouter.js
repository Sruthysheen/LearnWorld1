"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../../controller/chatController/chatController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const tutorMiddleware_1 = require("../../middleware/tutorMiddleware");
const chatRouter = express_1.default.Router();
chatRouter.post('/send-message', authMiddleware_1.isAuth, chatController_1.sendMessage);
chatRouter.get('/fetch-chat', authMiddleware_1.isAuth, chatController_1.fetchChats);
chatRouter.get('/fetch-tutor-chat', tutorMiddleware_1.protect, chatController_1.fetchChats);
chatRouter.post('/createConversation', authMiddleware_1.isAuth, chatController_1.createConversation);
chatRouter.post('/getUserMessages', chatController_1.getUserMessages);
exports.default = chatRouter;
