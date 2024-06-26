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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import "dotenv/config";
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../config/db"));
const express_session_1 = __importStar(require("express-session"));
const studentRouter_1 = require("./routes/studentRouter/studentRouter");
const tutorRouter_1 = require("./routes/tutorRouter/tutorRouter");
const adminRouter_1 = require("./routes/adminRouter/adminRouter");
const chatController_1 = require("./controller/chatController/chatController");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const nocache_1 = __importDefault(require("nocache"));
const morgan_1 = __importDefault(require("morgan"));
const chatRouter_1 = __importDefault(require("./routes/chatRouter/chatRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT);
const server = http_1.default.createServer(app);
const store = new express_session_1.MemoryStore();
console.log(process.env.PORT, 'port number in the env');
const io = require('socket.io')(5001, {
    cors: { origin: "http://localhost:5173" }
});
let users = [];
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
io.on("connection", (socket) => {
    console.log("connection==========");
    console.log("USER CONNECTED", socket?.id);
    socket.on("addUser", (userId) => {
        const isUserExist = users.find((user) => user.userId === userId);
        console.log(isUserExist, '-----');
        if (isUserExist) {
            // user exists,update the socketId
            isUserExist.socketId = socket.id;
        }
        else {
            // user does not exist,add new user
            const user = { userId, socketId: socket.id };
            users.push(user);
        }
        io.to(socket.id).emit("getUsers", users);
    });
    socket.on("sendMessage", async ({ conversationId, senderId, receiverId, message, media }) => {
        const data = {
            conversationId,
            senderId,
            receiverId,
            message,
            media
        };
        //create  a messaage
        const response = await (0, chatController_1.createAMessage)(data);
        if (response.status) {
            const receiver = users.find((user) => user.userId === receiverId);
            const sender = users.find((user) => user.userId === senderId);
            console.log("sender :>> ", sender);
            console.log("receiver :>> ", receiver);
            if (receiver) {
                console.log('get message', response.data);
                io.to(receiver?.socketId)
                    .to(sender?.socketId)
                    .emit("receiveMessage", { data: response.data });
            }
            else {
                console.log(sender, '999');
                io.to(sender?.socketId).emit('receiveMessage', { data: response.data });
            }
        }
        else {
            console.log(response.message);
        }
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
app.listen(port, () => console.log(`server is ruunig at port ${port}`));
