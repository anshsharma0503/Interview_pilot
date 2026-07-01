const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin(origin, callback) {
        if (!origin || origin === allowedOrigin) {
            return callback(null, true);
        }

        const error = new Error("Request origin is not allowed");
        error.code = "CORS_NOT_ALLOWED";
        return callback(error);
    },
    credentials: true
}));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "InterviewPilot backend is running"
    });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.use((err, req, res, next) => {
    if (err.code === "CORS_NOT_ALLOWED") {
        return res.status(403).json({
            success: false,
            message: "Request origin is not allowed"
        });
    }

    // Multer file-upload errors — return 400 with a clear message
    if (err.name === "MulterError") {
        let message = "File upload error";

        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File is too large. Maximum allowed size is 3 MB.";
        } else if (err.code === "LIMIT_FILE_COUNT") {
            message = "Too many files uploaded.";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected file field.";
        }

        return res.status(400).json({ success: false, message });
    }

    // Manual filter rejection (non-PDF mimetype)
    if (err.message === "Only PDF files are allowed") {
        return res.status(400).json({ success: false, message: err.message });
    }

    // Unexpected server error
    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


module.exports = app;
