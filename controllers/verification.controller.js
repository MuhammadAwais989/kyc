const { createDiditSession } = require("../services/didit.service");
const IdVerification = require("../models/IdVerification");

const redirectToDidit = async (req, res) => {
  try {
    const user = {
      _id: req.body.userId || "test_user_123",
      email: req.body.email || "test@gmail.com",
      firstName: req.body.firstName || "John",
      lastName: req.body.lastName || "Doe",
      dob: req.body.dob || "1990-01-01"
    };

    const session = await createDiditSession(user);

    // Save session including URL
    await IdVerification.create({
      user_id: user._id,
      session_id: session.session_id,
      vendor_data: session.vendor_data,
      status: session.status,
      metadata: session.metadata,
      url: session.url
    });

    return res.redirect(session.url);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create Didit session or redirect" });
  }
};

module.exports = { redirectToDidit };