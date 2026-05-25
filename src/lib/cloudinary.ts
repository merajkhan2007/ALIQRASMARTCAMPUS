import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary with securely assigned environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // 2 minutes — prevents timeout on larger uploads
});

/**
 * Uploads a Buffer to Cloudinary
 * @param buffer - The file buffer to upload
 * @param folder - Folder path within Cloudinary where the file should be saved
 * @returns A promise that resolves with the Cloudinary secure URL
 */
export async function uploadImage(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload returned no result and no error.'));
        }
      }
    );
    
    // Write buffer to stream and finalize
    uploadStream.end(buffer);
  });
}
