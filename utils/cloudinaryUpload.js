// utils/cloudinaryUpload.js
const cloudinary = require('../config/cloudinary');

/**
 * Upload an image to Cloudinary
 * @param {string} imageData - URL or base64 string of the image
 * @param {string} publicId - Optional public ID (will use session_id + image type)
 * @returns {Promise<string>} - Secure URL of the uploaded image
 */
const uploadImageToCloudinary = async (imageData, publicId = null) => {
  try {
    // If imageData is empty or null, return null
    if (!imageData) return null;

    const options = {
      folder: 'didit_verifications', // optional folder name
      public_id: publicId,
      resource_type: 'image',
    };

    // Upload the image (can be URL or base64)
    const result = await cloudinary.uploader.upload(imageData, options);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    return null; // or throw, depending on your error handling strategy
  }
};

module.exports = uploadImageToCloudinary;