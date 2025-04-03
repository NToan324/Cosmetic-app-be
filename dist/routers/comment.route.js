"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = __importDefault(require("../controllers/comment.controller"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.default)(comment_controller_1.default.getComments));
router.post("/", (0, asyncHandler_1.default)(comment_controller_1.default.addComment));
router.delete("/", (0, asyncHandler_1.default)(comment_controller_1.default.deleteComments));
exports.default = router;
