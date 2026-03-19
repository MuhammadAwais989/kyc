const IdVerification = require("../models/IdVerification");

const diditWebhook = async (req, res) => {
  try {
    // console.log("FULL WEBHOOK BODY:", JSON.stringify(req.body, null, 2));

    const {
      session_id,
      status,
      vendor_data,
      decision
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

    //  Extract images
    const images = idData
      ? {
          front: idData.front_image,
          back: idData.back_image,
          portrait: idData.portrait_image,
          full_front: idData.full_front_image,
          full_back: idData.full_back_image
        }
      : {};

    // Update DB
    const updated = await IdVerification.findOneAndUpdate(
      { session_id },
      {
        status,
        vendor_data,
        metadata: req.body.metadata,
        decision,
        documents,
        images
      },
      { new: true }
    );

    if (!updated) {
      console.log("❌ Session not found");
    } else {
      console.log("✅ Full KYC Data Stored");
    }

    res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error) {
    // console.error("❌ Webhook Error:", error.message);
    res.status(500).json({ error: "Webhook failed" });
  }
};

module.exports = { diditWebhook };