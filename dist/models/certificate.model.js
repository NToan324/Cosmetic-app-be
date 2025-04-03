"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const certificateSchema = new schema({
    title: String,
    description: String,
    urlImage: {
        type: String,
        required: true,
    },
    urlCertificate: String,
});
const certificate = mongoose_1.default.model("certificate", certificateSchema);
exports.default = certificate;
