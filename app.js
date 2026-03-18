// app.js
const express = require("express");
const app = express();

app.use(express.json());

const verificationRoutes = require("./routes/verification.routes");

app.use("/api", verificationRoutes);

module.exports = app;