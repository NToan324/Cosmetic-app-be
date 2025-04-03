import { Request, Response } from "express";
import uploadService from "../services/upload.service";
class UploadController {
  async uploadImage(req: Request, res: Response) {
    const { image } = req.body;
    return res.send(await uploadService.uploadImage(image));
  }
}

const uploadController = new UploadController();
export default uploadController;
