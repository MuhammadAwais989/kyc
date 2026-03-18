const mongoose = require("mongoose");

const IdVerificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  session_id: { type: String, required: true },
  status: { type: String, enum: ["Not Started","Approved","Declined","In Review"], default: "Not Started" },
  vendor_data: { type: String },
  metadata: { type: Object },
  url: { type: String }, // Save Didit redirect URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("IdVerification", IdVerificationSchema);