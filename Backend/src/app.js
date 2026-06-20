const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "InterviewPilot backend is running"
    });
});

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


module.exports = app;