import { Request, Response } from "express";
import commentService from "../services/comment.service";
interface Comment {
  name: string;
  message: string;
  urlImage?: string;
}
class CommentController {
  async getComments(req: Request, res: Response) {
    res.send(await commentService.getComments());
  }
  async addComment(req: Request, res: Response) {
    const { name, message, urlImage } = req.body;
    res.send(await commentService.addComment({ name, message, urlImage }));
  }

  async deleteComments(req: Request, res: Response) {
    res.send(await commentService.deleteComments());
  }
}

const commentController = new CommentController();
export default commentController;
