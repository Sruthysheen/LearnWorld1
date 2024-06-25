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
var express_1 = __importDefault(require("express"));
require("dotenv/config");
var db_1 = __importDefault(require("../config/db"));
var express_session_1 = __importStar(require("express-session"));
var studentRouter_1 = require("./routes/studentRouter/studentRouter");
var tutorRouter_1 = require("./routes/tutorRouter/tutorRouter");
var adminRouter_1 = require("./routes/adminRouter/adminRouter");
var chatController_1 = require("./controller/chatController/chatController");
var http_1 = __importDefault(require("http"));
var cors_1 = __importDefault(require("cors"));
var nocache_1 = __importDefault(require("nocache"));
var morgan_1 = __importDefault(require("morgan"));
var chatRouter_1 = __importDefault(require("./routes/chatRouter/chatRouter"));
var app = (0, express_1.default)();
var port = Number(process.env.PORT);
var server = http_1.default.createServer(app);
var store = new express_session_1.MemoryStore();
var io = require('socket.io')(5001, {
    cors: { origin: "http://localhost:5173" }
});
var users = [];
var emailToSocketIdMap = new Map();
var socketidToEmailMap = new Map();
io.on("connection", function (socket) {
    console.log("connection==========");
    console.log("USER CONNECTED", socket === null || socket === void 0 ? void 0 : socket.id);
    socket.on("addUser", function (userId) {
        var isUserExist = users.find(function (user) { return user.userId === userId; });
        console.log(isUserExist, '-----');
        if (isUserExist) {
            // user exists,update the socketId
            isUserExist.socketId = socket.id;
        }
        else {
            // user does not exist,add new user
            var user = { userId: userId, socketId: socket.id };
            users.push(user);
        }
        io.to(socket.id).emit("getUsers", users);
    });
    socket.on("sendMessage", function (_a) {
        var conversationId = _a.conversationId, senderId = _a.senderId, receiverId = _a.receiverId, message = _a.message, media = _a.media;
        return __awaiter(void 0, void 0, void 0, function () {
            var data, response, receiver, sender;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = {
                            conversationId: conversationId,
                            senderId: senderId,
                            receiverId: receiverId,
                            message: message,
                            media: media
                        };
                        return [4 /*yield*/, (0, chatController_1.createAMessage)(data)];
                    case 1:
                        response = _b.sent();
                        if (response.status) {
                            receiver = users.find(function (user) { return user.userId === receiverId; });
                            sender = users.find(function (user) { return user.userId === senderId; });
                            console.log("sender :>> ", sender);
                            console.log("receiver :>> ", receiver);
                            if (receiver) {
                                console.log('get message', response.data);
                                io.to(receiver === null || receiver === void 0 ? void 0 : receiver.socketId)
                                    .to(sender === null || sender === void 0 ? void 0 : sender.socketId)
                                    .emit("receiveMessage", { data: response.data });
                            }
                            else {
                                console.log(sender, '999');
                                io.to(sender === null || sender === void 0 ? void 0 : sender.socketId).emit('receiveMessage', { data: response.data });
                            }
                        }
                        else {
                            console.log(response.message);
                        }
                        return [2 /*return*/];
                }
            });
        });
    });
});
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 60 * 1000,
    },
    store: store,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use((0, nocache_1.default)());
app.use((0, morgan_1.default)('tiny'));
db_1.default.connect();
app.use('/student', studentRouter_1.studentRouter);
app.use('/tutor', tutorRouter_1.tutorRouter);
app.use('/admin', adminRouter_1.adminRouter);
app.use('/chat', chatRouter_1.default);
app.listen(port, function () { return console.log("server is ruunig at port ".concat(port)); });
