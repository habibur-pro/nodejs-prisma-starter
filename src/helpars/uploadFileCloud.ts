import ApiError from "../errors/ApiErrors";
import { uploadFileToSpace } from "./uploadToS3";

export const uploadFile = async (
  file: Express.Multer.File,
  fileName: string
) => {
  if (!file) {
    throw new ApiError(400, `${fileName} image is required`);
  }
  return await uploadFileToSpace(file);
};
