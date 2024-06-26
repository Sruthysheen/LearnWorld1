"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAMessage = exports.getUserMessages = exports.createConversation = exports.fetchChats = exports.sendMessage = void 0;
const chatModel_1 = __importDefault(require("../../models/chatModel"));
const messageModel_1 = __importDefault(require("../../models/messageModel"));
const chatModel_2 = __importDefault(require("../../models/chatModel"));
const sendMessage = async (req, res) => {
    try {
        console.log(req.userId, "req.userIdreq.userId");
        const myId = req.userId;
        console.log(myId, "myId");
        console.log(req.body, "req.bodyreq.body");
        const { message, userId } = req.body;
        console.log(message, "message");
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        let chatId;
        let chat = await chatModel_1.default.findOne({
            participants: { $all: [myId, userId] }
        });
        if (!chat) {
            console.log("!chat");
            chat = await chatModel_1.default.create({
                participants: [myId, userId]
            });
        }
        console.log(chat, "chatchat");
        chatId = chat._id;
        const newMessage = new messageModel_1.default({
            conversationId: chatId,
            senderId: myId,
            receiverId: userId,
            message,
        });
        await newMessage.save();
        res.status(201).json({ message: "message created successfully" });
    }
    catch (error) {
        console.log("error while creating message", error);
        res.status(500).json({ error: "Internal server Error" });
    }
};
exports.sendMessage = sendMessage;
const fetchChats = async (req, res) => {
    try {
        console.log(req.query, "req.param");
        const { id } = req.query;
        const messages = await messageModel_1.default.find({ conversationId: id });
        if (messages.length > 0) {
            console.log("message fetch");
            return res.status(200).json({ status: true, data: messages });
        }
        else {
            console.log("no message fetch");
            return res.status(200).json({ status: true, data: [] });
        }
    }
    catch (error) {
        console.error("Error in fetchChats:", error);
        res.status(400).json({ status: false, message: "Error while fetching messages" });
    }
};
exports.fetchChats = fetchChats;
const createConversation = async (req, res) => {
    const { userId, tutorId } = req.body;
    try {
        // Check if a conversation already exists
        const alreadyExist = await chatModel_1.default.findOne({
            participants: {
                $all: [
                    { $elemMatch: { userId } },
                    { $elemMatch: { tutorId } },
                ],
            },
        });
        if (alreadyExist) {
            return res.status(200).json({ status: true, data: alreadyExist });
        }
        // Create a new conversation if it doesn't exist
        const newConversation = await chatModel_1.default.create({
            participants: [
                {
                    userId,
                    tutorId,
                },
            ],
        });
        console.log(newConversation, 'THIS IS NEW CONVERSATION');
        if (newConversation) {
            return res.status(200).json({ status: true, data: newConversation });
        }
        else {
            return res.status(400).json({ status: false, message: 'New Conversation creation failed ...!' });
        }
    }
    catch (error) {
        return res.status(400).json({ status: false, message: `Something went wrong ..! ${error}` });
    }
};
exports.createConversation = createConversation;
const getUserMessages = async (req, res) => {
    const { tutorId } = req.body;
    console.log(tutorId, ")))))))");
    try {
        const messageDataAndUserData = await chatModel_1.default.find({
            'participants.tutorId': tutorId
        }).populate("participants.userId");
        if (messageDataAndUserData) {
            return res.status(200).json({ status: true, data: messageDataAndUserData });
        }
        else {
            return res.status(400).json({ status: false, message: "NO DATA FOUND" });
        }
    }
    catch (error) {
        return res.status(400).json({ status: false, message: `Some thing went wrong ...! ${error}` });
    }
};
exports.getUserMessages = getUserMessages;
const createAMessage = async (data) => {
    try {
        const { conversationId, senderId, receiverId, message, media } = data;
        const newMessage = await messageModel_1.default.create({
            conversationId,
            senderId,
            receiverId,
            message,
            media
        });
        console.log(newMessage, "..........................");
        await chatModel_2.default.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage.message,
            $push: { messages: newMessage._id },
        }, { new: true });
        if (newMessage) {
            return { status: true, data: newMessage };
        }
        else {
            return { status: false, message: `new message Creation failed..!` };
        }
    }
    catch (error) {
        return { status: false, message: `something went wrong ${error}` };
    }
};
exports.createAMessage = createAMessage;
