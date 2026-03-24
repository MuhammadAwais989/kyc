const { createDiditSession } = require("../services/didit.service");
const IdVerification = require("../models/IdVerification");

const redirectToDidit = async (req, res) => {
  try {
    const user = {
      _id: req.body.userId || null,
      email: req.body.email || null,
      firstName: req.body.firstName || null,
      lastName: req.body.lastName || null,
      dob: req.body.dob || null
    };

    const session = await createDiditSession(user);

    // Save initial session info
    await IdVerification.create({
      user_id: user._id,
      session_id: session.session_id,
      vendor_data: session.vendor_data,
      status: session.status,
      metadata: session.metadata,
      url: session.url
    });

    // Redirect user to Didit verification page
    return res.redirect(session.url);

  } catch (error) {
    console.error("Verification redirect error:", error);
    return res.status(500).json({ error: "Failed to create Didit session or redirect" });
  }
};

module.exports = { redirectToDidit };