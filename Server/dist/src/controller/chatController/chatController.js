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
exports.createAMessage = exports.getUserMessages = exports.createConversation = exports.fetchChats = exports.sendMessage = void 0;
var chatModel_1 = __importDefault(require("../../models/chatModel"));
var messageModel_1 = __importDefault(require("../../models/messageModel"));
var chatModel_2 = __importDefault(require("../../models/chatModel"));
var sendMessage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var myId, _a, message, userId, chatId, chat, newMessage, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log(req.userId, "req.userIdreq.userId");
                myId = req.userId;
                console.log(myId, "myId");
                console.log(req.body, "req.bodyreq.body");
                _a = req.body, message = _a.message, userId = _a.userId;
                console.log(message, "message");
                if (!message) {
                    return [2 /*return*/, res.status(400).json({ error: 'Message is required' })];
                }
                chatId = void 0;
                return [4 /*yield*/, chatModel_1.default.findOne({
                        participants: { $all: [myId, userId] }
                    })];
            case 1:
                chat = _b.sent();
                if (!!chat) return [3 /*break*/, 3];
                console.log("!chat");
                return [4 /*yield*/, chatModel_1.default.create({
                        participants: [myId, userId]
                    })];
            case 2:
                chat = _b.sent();
                _b.label = 3;
            case 3:
                console.log(chat, "chatchat");
                chatId = chat._id;
                newMessage = new messageModel_1.default({
                    conversationId: chatId,
                    senderId: myId,
                    receiverId: userId,
                    message: message,
                });
                return [4 /*yield*/, newMessage.save()];
            case 4:
                _b.sent();
                res.status(201).json({ message: "message created successfully" });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.log("error while creating message", error_1);
                res.status(500).json({ error: "Internal server Error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.sendMessage = sendMessage;
var fetchChats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, messages, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(req.query, "req.param");
                id = req.query.id;
                return [4 /*yield*/, messageModel_1.default.find({ conversationId: id })];
            case 1:
                messages = _a.sent();
                if (messages.length > 0) {
                    console.log("message fetch");
                    return [2 /*return*/, res.status(200).json({ status: true, data: messages })];
                }
                else {
                    console.log("no message fetch");
                    return [2 /*return*/, res.status(200).json({ status: true, data: [] })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error in fetchChats:", error_2);
                res.status(400).json({ status: false, message: "Error while fetching messages" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchChats = fetchChats;
var createConversation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, tutorId, alreadyExist, newConversation, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, tutorId = _a.tutorId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, chatModel_1.default.findOne({
                        participants: {
                            $all: [
                                { $elemMatch: { userId: userId } },
                                { $elemMatch: { tutorId: tutorId } },
                            ],
                        },
                    })];
            case 2:
                alreadyExist = _b.sent();
                if (alreadyExist) {
                    return [2 /*return*/, res.status(200).json({ status: true, data: alreadyExist })];
                }
                return [4 /*yield*/, chatModel_1.default.create({
                        participants: [
                            {
                                userId: userId,
                                tutorId: tutorId,
                            },
                        ],
                    })];
            case 3:
                newConversation = _b.sent();
                console.log(newConversation, 'THIS IS NEW CONVERSATION');
                if (newConversation) {
                    return [2 /*return*/, res.status(200).json({ status: true, data: newConversation })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ status: false, message: 'New Conversation creation failed ...!' })];
                }
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(400).json({ status: false, message: "Something went wrong ..! ".concat(error_3) })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createConversation = createConversation;
var getUserMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tutorId, messageDataAndUserData, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tutorId = req.body.tutorId;
                console.log(tutorId, ")))))))");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, chatModel_1.default.find({
                        'participants.tutorId': tutorId
                    }).populate("participants.userId")];
            case 2:
                messageDataAndUserData = _a.sent();
                if (messageDataAndUserData) {
                    return [2 /*return*/, res.status(200).json({ status: true, data: messageDataAndUserData })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ status: false, message: "NO DATA FOUND" })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                return [2 /*return*/, res.status(400).json({ status: false, message: "Some thing went wrong ...! ".concat(error_4) })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUserMessages = getUserMessages;
var createAMessage = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var conversationId, senderId, receiverId, message, media, newMessage, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                conversationId = data.conversationId, senderId = data.senderId, receiverId = data.receiverId, message = data.message, media = data.media;
                return [4 /*yield*/, messageModel_1.default.create({
                        conversationId: conversationId,
                        senderId: senderId,
                        receiverId: receiverId,
                        message: message,
                        media: media
                    })];
            case 1:
                newMessage = _a.sent();
                console.log(newMessage, "..........................");
                return [4 /*yield*/, chatModel_2.default.findByIdAndUpdate(conversationId, {
                        lastMessage: newMessage.message,
                        $push: { messages: newMessage._id },
                    }, { new: true })];
            case 2:
                _a.sent();
                if (newMessage) {
                    return [2 /*return*/, { status: true, data: newMessage }];
                }
                else {
                    return [2 /*return*/, { status: false, message: "new message Creation failed..!" }];
                }
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, { status: false, message: "something went wrong ".concat(error_5) }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createAMessage = createAMessage;
