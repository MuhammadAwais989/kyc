const axios = require("axios");
const cloudinary = require("../config/cloudinary");

const generateAndUploadPdf = async (session_id) => {
  try {
    if (!session_id) throw new Error("Missing session_id for PDF generation");

    // Call Didit API to generate PDF
    const response = await axios.get(
      `https://verification.didit.me/v3/session/${session_id}/generate-pdf`,
      {
        headers: { "x-api-key": process.env.DIDIT_API_KEY },
        responseType: "arraybuffer" // PDF binary
      }
    );

    const pdfBuffer = response.data;

    // Upload PDF to Cloudinary (raw)
    const cloudinaryUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "didit_verifications",
          public_id: `${session_id}_verification_report`,
          resource_type: "raw" // PDF format
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(pdfBuffer);
    });

    console.log("✅ PDF uploaded to Cloudinary:", cloudinaryUrl);
    return cloudinaryUrl;

  } catch (error) {
    console.error("❌ PDF generation/upload error:", error.response?.data || error.message);
    return null;
  }
};

module.exports = { generateAndUploadPdf };