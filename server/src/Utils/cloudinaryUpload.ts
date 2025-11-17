import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLAUDINARY_CLOUD_NAME,
    api_key: process.env.CLAUDINARY_API_KEY,
    api_secret: process.env.CLAUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (
    localFilePath: string,
    resourceType: "image" | "video" | "raw" | "auto" = "image"
): Promise<string | null> => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
        });

        return response.secure_url || response.url;
    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error.message);

        // delete local file if upload fails
        try {
            await fs.promises.unlink(localFilePath);
            console.log("Temp file deleted:", localFilePath);
        } catch (unlinkErr: any) {
            console.error("Failed to delete temp file:", unlinkErr.message);
        }

        return null;
    }
    finally {
        await fs.promises.unlink(localFilePath);
        console.log("Temp file deleted:", localFilePath);
    }
};
