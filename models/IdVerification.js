const mongoose = require("mongoose");

const IdVerificationSchema = new mongoose.Schema({
  user_id: String,
  session_id: String,
  status: String,
  vendor_data: String,
  metadata: Object,
  url: String,
  documents: Array,
  images: Object,
    pdf_url: String, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("IdVerification", IdVerificationSchema);