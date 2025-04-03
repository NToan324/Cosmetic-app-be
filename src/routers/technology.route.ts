import { Router } from "express";
import technologyController from "../controllers/techonology.controller";
import asyncHandler from "../middleware/asyncHandler";
const router = Router();

router.get("/", asyncHandler(technologyController.getTechnologies));
router.post("/", asyncHandler(technologyController.addTechnologies));

export default router;
