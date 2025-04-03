"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
async function connectDB() {
    const url = process.env.MONGODB_URL || "";
    try {
        // Await the connection to ensure the app won't proceed without connecting
        await mongoose_1.default.connect(url);
        console.log(`MongoDB connected`);
    }
    catch (error) {
        console.error(`Error connecting to the database: ${error}`);
        process.exit(1); // Exit the process if unable to connect
    }
    const dbConnection = mongoose_1.default.connection;
    dbConnection.on("error", (err) => {
        console.error(`Connection failed: ${err.message}`);
    });
}
