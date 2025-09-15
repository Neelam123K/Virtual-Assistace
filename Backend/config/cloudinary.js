import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    console.log("File :", filePath);
    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); 
    console.log("Cloudinary upload result:", uploadResult);
    return uploadResult.secure_url;

  } catch (error) {
    console.error("Cloudinary upload error:", error);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
    }

    return null; 
  }
};

export default uploadOnCloudinary;
