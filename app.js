// app.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const verificationRoutes = require("./routes/verification.routes");

app.use("/api", verificationRoutes);

module.exports = app;