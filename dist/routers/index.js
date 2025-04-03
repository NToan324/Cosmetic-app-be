"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_route_1 = __importDefault(require("./project.route"));
const technology_route_1 = __importDefault(require("./technology.route"));
const sendEmail_route_1 = __importDefault(require("./sendEmail.route"));
const comment_route_1 = __importDefault(require("./comment.route"));
const upload_route_1 = __importDefault(require("./upload.route"));
const router = (0, express_1.Router)();
router.use("/project", project_route_1.default);
router.use("/technology", technology_route_1.default);
router.use("/email", sendEmail_route_1.default);
router.use("/comment", comment_route_1.default);
router.use("/upload", upload_route_1.default);
exports.default = router;
