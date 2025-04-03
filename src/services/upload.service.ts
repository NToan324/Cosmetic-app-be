import { CreatedResponse } from "../core/success.response";
import cloudinaryV2 from "../storage/storage";
class UploadService {
  async uploadImage(file: string) {
    await cloudinaryV2.uploader.upload(file, (error, result) => {
      if (error) {
        throw new Error("Error uploading image");
      }
      return new CreatedResponse("Image uploaded", result);
    });
  }
}

const uploadService = new UploadService();
export default uploadService;
