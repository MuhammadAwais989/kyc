const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = async (imageData, publicId = null) => {
  try {
    if (!imageData) return null;

    const options = {
      folder: 'didit_verifications',
      public_id: publicId,
      resource_type: 'image',
    };

    // Base64 string or URL
    if (imageData.startsWith("data:image/")) {
      const result = await cloudinary.uploader.upload(imageData, options);
      return result.secure_url;
    }

    // Normal URL
    const result = await cloudinary.uploader.upload(imageData, options);
    return result.secure_url;

  } catch (error) {
    console.error('Cloudinary upload error:', error.response?.data || error.message || error);
    return null;
  }
};

module.exports = uploadImageToCloudinary;