const axios = require("axios");
const IdVerification = require("../models/IdVerification");

const downloadPdf = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find record from DB
    const record = await IdVerification.findOne({ session_id: sessionId });

    if (!record || !record.pdf_url) {
      return res.status(404).send("PDF not ready");
    }

    // Fetch PDF from Cloudinary
    const pdfResponse = await axios.get(record.pdf_url, {
      responseType: "stream"
    });

    // Force download in browser
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${sessionId}_verification_report.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Pipe PDF stream to response
    pdfResponse.data.pipe(res);

  } catch (error) {
    console.error("❌ PDF download error:", error.message);
    res.status(500).send("PDF download failed");
  }
};

module.exports = { downloadPdf };