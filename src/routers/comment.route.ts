import { Router } from "express";
import commentController from "../controllers/comment.controller";
import asyncHandler from "../middleware/asyncHandler";
const router = Router();

router.get("/", asyncHandler(commentController.getComments));
router.post("/", asyncHandler(commentController.addComment));
router.delete("/", asyncHandler(commentController.deleteComments));

export default router;
