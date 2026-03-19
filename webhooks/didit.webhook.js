const IdVerification = require("../models/IdVerification");
const uploadImageToCloudinary = require("../utils/cloudinaryUpload");

const diditWebhook = async (req, res) => {
  try {
    const {
      session_id,
      status,
      vendor_data,
      decision,
      metadata
    } = req.body;

    // Extract document data
    const idData = decision?.id_verifications?.[0];

    const documents = idData
      ? [{
          document_number: idData.document_number,
          document_type: idData.document_type,
          full_name: idData.full_name,
          first_name: idData.first_name,
          last_name: idData.last_name,
          dob: idData.date_of_birth,
          gender: idData.gender,
          address: idData.formatted_address,
          nationality: idData.issuing_state_name
        }]
      : [];

    // Extract image URLs/Base64 from webhook
    const rawImages = idData
      ? {
          front: idData.front_image,
          back: idData.back_image,
          portrait: idData.portrait_image,
          full_front: idData.full_front_image,
          full_back: idData.full_back_image
        }
      : {};

    // Upload each image to Cloudinary and collect the secure URLs
    const uploadPromises = Object.entries(rawImages).map(async ([key, imageData]) => {
      if (!imageData) return [key, null];

      // Generate a unique public ID using session_id and image type
      const publicId = `${session_id}_${key}`;
      const cloudinaryUrl = await uploadImageToCloudinary(imageData, publicId);
      return [key, cloudinaryUrl];
    });

    const uploadedEntries = await Promise.all(uploadPromises);
    const images = Object.fromEntries(uploadedEntries);

    // Update the database with the new image URLs
    const updated = await IdVerification.findOneAndUpdate(
      { session_id },
      {
        status,
        vendor_data,
        metadata,
        decision,
        documents,
        images // Now contains Cloudinary URLs
      },
      { new: true }
    );

    if (!updated) {
      console.log("❌ Session not found");
    } else {
      console.log("✅ Full KYC Data Stored with Cloudinary images");
    }

    res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.status(500).json({ error: "Webhook failed" });
  }
};

module.exports = { diditWebhook };