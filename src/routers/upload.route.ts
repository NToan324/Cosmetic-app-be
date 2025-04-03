import { Router } from "express";
import uploadController from "../controllers/upload.controller";
import asyncHandler from "../middleware/asyncHandler";
const router = Router();

router.post("/", asyncHandler(uploadController.uploadImage));

export default router;
