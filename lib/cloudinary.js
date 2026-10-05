import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

/**
 * Uploads a base64/data-URI image buffer to Cloudinary and returns the
 * secure URL. Only ever called server-side — the API secret never
 * reaches the client.
 */
export async function uploadImage(dataUri, folder = "tourmate") {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured.");
  }
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    transformation: [{ width: 1200, height: 1200, crop: "limit" }, { quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}
