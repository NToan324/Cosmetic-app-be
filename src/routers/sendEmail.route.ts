import { Router } from "express";
import emailController from "../controllers/sendEmail.controller";
import asyncHandler from "../middleware/asyncHandler";
const router = Router();

router.post("/", asyncHandler(emailController.sendEmail));

export default router;
