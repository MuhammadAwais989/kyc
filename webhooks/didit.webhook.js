const IdVerification = require("../models/IdVerification");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const { generateAndUploadPdf } = require("../services/diditPdf.service");

const diditWebhook = async (req, res) => {
  try {
    // Handle POST (webhook) or GET (testing)
    const data = req.method === "POST" ? req.body : req.query;

    const session_id = data.session_id || data.verificationSessionId;
    if (!session_id) return res.status(400).json({ error: "Missing session_id" });

    const { status, vendor_data, decision, metadata } = data;

    // Extract document info
    const idData = decision?.id_verifications?.[0];
    const documents = idData ? [{
      document_number: idData.document_number,
      document_type: idData.document_type,
      full_name: idData.full_name,
      first_name: idData.first_name,
      last_name: idData.last_name,
      dob: idData.date_of_birth,
      gender: idData.gender,
      address: idData.formatted_address,
      nationality: idData.issuing_state_name
    }] : [];

    // Upload images to Cloudinary
    const rawImages = idData ? {
      front: idData.front_image,
      back: idData.back_image,
      portrait: idData.portrait_image,
      full_front: idData.full_front_image,
      full_back: idData.full_back_image
    } : {};

    const uploadPromises = Object.entries(rawImages).map(async ([key, imageData]) => {
      if (!imageData) return [key, null];
      const publicId = `${session_id}_${key}`;
      const url = await uploadToCloudinary(imageData, publicId);
      return [key, url];
    });

    const uploadedEntries = await Promise.all(uploadPromises);
    const images = Object.fromEntries(uploadedEntries);

    // Generate PDF and upload to Cloudinary
    const pdf_url = await generateAndUploadPdf(session_id);

    // Update DB
    const updated = await IdVerification.findOneAndUpdate(
      { session_id },
      { status, vendor_data, metadata, decision, documents, images, pdf_url },
      { returnDocument: 'after' }
    );

    if (!updated) console.log("❌ Session not found");
    else console.log("✅ KYC, images & PDF stored successfully");

    // ✅ Automatic download URL
    const downloadUrl = `${process.env.BASE_URL}/api/download-pdf/${session_id}`;

    // If webhook is called via browser (for testing), redirect user
    if (req.query.autoDownload === "true") {
      return res.redirect(downloadUrl);
    }

    // Otherwise, return download URL in webhook response
    res.status(200).json({ message: "Webhook processed successfully", downloadUrl });

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.status(500).json({ error: "Webhook failed" });
  }
};

module.exports = { diditWebhook };