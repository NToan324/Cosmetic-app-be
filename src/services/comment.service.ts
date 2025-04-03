import { error } from "console";
import { SOCKET_ACTION } from "../constants";
import { BadRequestError } from "../core/error.response";
import { OkResponse } from "../core/success.response";
import comment, { Comment } from "../models/comment.model";
import cloudinaryV2 from "../storage/storage";
import SocketInstance from "./socket.instance";
class CommentService {
  async getComments() {
    const response = await comment.find().sort({ date: -1 });
    if (!response) {
      throw new BadRequestError("Error getting comments");
    }
    return new OkResponse("Comments found", response);
  }

  async addComment({
    name,
    message,
    urlImage,
  }: {
    name: string;
    message: string;
    urlImage: string;
  }) {
    let resultImage = "";
    if (urlImage && urlImage !== "") {
      const uploadedImage = await cloudinaryV2.uploader.upload(urlImage, {
        transformation: {
          width: 100,
          height: 100,
          crop: "fill",
        },
      });
      resultImage = uploadedImage?.secure_url ?? "";
    }
    const response = await comment.create({
      name,
      message,
      urlImage: resultImage,
    });

    if (!response) {
      throw new BadRequestError("Error adding comment");
    }
    SocketInstance.getIO().emit(SOCKET_ACTION.GET_COMMENTS, response);
    return new OkResponse("Comment added", response);
  }

  async deleteComments() {
    const response = await comment.deleteMany();
    if (!response) {
      throw new BadRequestError("Error deleting comments");
    }
    return new OkResponse("Comments deleted", response);
  }
}

const commentService = new CommentService();
export default commentService;
