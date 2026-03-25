const express = require("express");
const app = express();
const cors = require("cors");
const verificationRoutes = require("./routes/verification.routes");
const downloadRoutes = require("./routes/download.routes");

app.use(express.json());
app.use(cors(
    {
        origin: "*"
    }
));


app.use("/api", verificationRoutes);
app.use("/api", downloadRoutes);

module.exports = app;