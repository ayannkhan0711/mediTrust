import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (fileLink) => {
    try {
        if (!fileLink) return null;

        const uploadResult = await cloudinary.uploader.upload(fileLink, {
            resource_type: "auto"
        });

        // upload successful, remove local file
        fs.unlinkSync(fileLink);

        return uploadResult;
    } catch (error) {
        console.log("Cloudinary upload error:", error);
        // remove local file even if upload fails, agar file exist karti ho
        if (fs.existsSync(fileLink)) {
            fs.unlinkSync(fileLink);
        }
        return null;
    }
};

export default uploadOnCloudinary;