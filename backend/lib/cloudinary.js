import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

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

    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    return response;
  } catch (error) {
    fs.unlink(localFilePath, (err) => {
      if (err) console.log("Error deleting file:", err);
    });
    console.log(error);
    return res.status(500).json({
      message: "Cloudinary server error while uploading file.",
      success: false,
    });
  }
};

export { uploadOnCloudinary };
