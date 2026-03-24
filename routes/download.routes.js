const express = require("express");
const router = express.Router();
const { downloadPdf } = require("../controllers/download.controller");

router.get("/download-pdf/:sessionId", downloadPdf);

module.exports = router;