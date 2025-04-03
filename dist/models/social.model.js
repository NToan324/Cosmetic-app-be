"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const socialSchema = new schema({
    urlImage: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    socialName: {
        type: String,
        required: true,
    },
});
const social = mongoose_1.default.model("social", socialSchema);
exports.default = social;
