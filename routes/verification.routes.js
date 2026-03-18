// routes/verification.routes.js
const express = require("express");
const router = express.Router();
const { redirectToDidit } = require("../controllers/verification.controller");
const { diditWebhook } = require("../webhooks/didit.webhook");

router.get("/verify", redirectToDidit);        // redirect user to Didit
router.post("/webhook/didit", diditWebhook);   // webhook endpoint

module.exports = router;