"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = __importDefault(require("../controllers/upload.controller"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const router = (0, express_1.Router)();
router.post("/", (0, asyncHandler_1.default)(upload_controller_1.default.uploadImage));
exports.default = router;
