// webhooks/didit.webhook.js
const IdVerification = require("../models/IdVerification");

const diditWebhook = async (req, res) => {
  try {
    const { verificationSessionId, status } = req.query; // ✅ Query params

    const verification = await IdVerification.findOne({ session_id: verificationSessionId });
    if (verification) {
      verification.status = status; // Approved / Declined / In Review
      await verification.save();
      console.log("Status updated in DB");
    } else {
      console.log("Session not found in DB");
    }

    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Webhook error" });
  }
};

module.exports = { diditWebhook };