// webhooks/didit.webhook.js
const IdVerification = require("../models/IdVerification");

const diditWebhook = async (req, res) => {
  try {
    const { session_id, status, vendor_data, metadata } = req.body;

    console.log("Webhook received:", req.body);

    // Update DB
    const verification = await IdVerification.findOne({ session_id });
    if (verification) {
      verification.status = status;
      verification.metadata = metadata || verification.metadata;
      await verification.save();
    }

    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Webhook error" });
  }
};

module.exports = { diditWebhook };