import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// clodinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return res
        .status(400)
        .json({ message: "localFilePath is not found", success: false });
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlink(localFilePath);
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Cloudinary server error while uploading file.",
        success: false,
      });
  }
};

export { uploadOnCloudinary };
