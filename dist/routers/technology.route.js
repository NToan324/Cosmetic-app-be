"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const techonology_controller_1 = __importDefault(require("../controllers/techonology.controller"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.default)(techonology_controller_1.default.getTechnologies));
router.post("/", (0, asyncHandler_1.default)(techonology_controller_1.default.addTechnologies));
exports.default = router;
