// routes/verification.routes.js
const express = require("express");
const router = express.Router();
const { redirectToDidit } = require("../controllers/verification.controller");
const { diditWebhook } = require("../webhooks/didit.webhook");

router.post("/verify", redirectToDidit);        
router.post("/webhook/didit", diditWebhook);   
router.get("/webhook/didit", diditWebhook);   

module.exports = router;