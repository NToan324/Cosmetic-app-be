import { Router } from "express";
import projectRouter from "./project.route";
import technologyRouter from "./technology.route";
import emailRouter from "./sendEmail.route";
import commentRouter from "./comment.route";
import uploadRouter from "./upload.route";
const router = Router();

router.use("/project", projectRouter);
router.use("/technology", technologyRouter);
router.use("/email", emailRouter);
router.use("/comment", commentRouter);
router.use("/upload", uploadRouter);

export default router;
