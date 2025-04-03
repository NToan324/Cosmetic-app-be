"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const router = (0, express_1.Router)();
router.post("/", (0, asyncHandler_1.default)(project_controller_1.default.addProject));
router.get("/", (0, asyncHandler_1.default)(project_controller_1.default.getProjects));
router.get("/:id", (0, asyncHandler_1.default)(project_controller_1.default.getProject));
router.delete("/:id", (0, asyncHandler_1.default)(project_controller_1.default.deleteProject));
exports.default = router;
