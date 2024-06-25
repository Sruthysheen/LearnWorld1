"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var dbName = 'LearnWorld';
var dbUrl = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3';
var connectToDb = {
    connect: function () {
        mongoose_1.default.connect(dbUrl, { dbName: dbName })
            .then(function () { return console.log('Connected to MongoDB'); })
            .catch(function (error) { return console.error('Error connecting to MongoDB:', error); });
    }
};
exports.default = connectToDb;
