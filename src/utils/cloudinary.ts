import axios from 'axios';

// Configuration
const CLOUD_NAME = "Mediaflows_b2db7492-4e7b-46d1-9e39-89263c9cf98f";
const UPLOAD_PRESET = "sg_hub_uploads"; // You need to create this in Cloudinary Dashboard -> Settings -> Upload -> Upload presets (Mode: Unsigned)

/**
 * Upload a file to Cloudinary
 * @param file File object to upload
 * @param folder Optional folder path in Cloudinary
 */
export const uploadToCloudinary = async (file: File, folder: string = "general"): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET); 
  formData.append("folder", folder);
  // formData.append("api_key", "JdEhdhEqKjVLZHZcNN4Okr8VGXY"); // Usually not needed for unsigned uploads

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

/**
 * Optimize Cloudinary Image URL
 * @param url Original Cloudinary URL
 * @param width Target width
 * @param height Target height
 */
export const getOptimizedUrl = (url: string, width: number = 800, height?: number) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  // Insert transformations after /upload/
  const parts = url.split("/upload/");
  const transformations = [`w_${width}`, "c_limit", "q_auto", "f_auto"];
  
  if (height) {
    transformations.push(`h_${height}`);
  }
  
  return `${parts[0]}/upload/${transformations.join(",")}/${parts[1]}`;
};

