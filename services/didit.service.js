const axios = require("axios");

const createDiditSession = async (user) => {
  try {
    const payload = {
      workflow_id: process.env.DIDIT_WORKFLOW_ID,
      vendor_data: user._id,
      callback: `${process.env.BASE_URL}/api/webhook/didit`,
      callback_method: "both",
      metadata: JSON.stringify({ email: user.email }),
      contact_details: {
        email: user.email,
        send_notification_emails: true,
      },
      expected_details: {
        first_name: user.firstName || "John",
        last_name: user.lastName || "Doe",
        date_of_birth: user.dob || "1990-01-01"
      },
      language: "en"
    };

    const response = await axios.post(
      "https://verification.didit.me/v3/session/",
      payload,
      {
        headers: {
          "x-api-key": process.env.DIDIT_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.data.url) {
      throw new Error("Didit session URL missing in response");
    }

    return response.data; // session_id, url, metadata, etc.
  } catch (error) {
    console.error("Didit session error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { createDiditSession };