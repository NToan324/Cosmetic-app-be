import { Router } from "express";
import projectController from "../controllers/project.controller";
import asyncHandler from "../middleware/asyncHandler";
const router = Router();

router.post("/", asyncHandler(projectController.addProject));
router.get("/", asyncHandler(projectController.getProjects));
router.get("/:id", asyncHandler(projectController.getProject));
router.delete("/:id", asyncHandler(projectController.deleteProject));

export default router;
