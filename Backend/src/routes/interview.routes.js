const express = require("express");
const {
    createInterviewReport,
    getInterviewReports,
    getInterviewReportById,
    downloadTailoredResume
} = require("../controllers/interview.controller");

const { requireAuth } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const uploadResume = require("../middlewares/fileUpload.middleware");

const interviewRouter = express.Router();

interviewRouter.post(
    "/",
    asyncHandler(requireAuth),
    uploadResume.single("resume"),
    asyncHandler(createInterviewReport)
);

interviewRouter.get(
    "/",
    asyncHandler(requireAuth),
    asyncHandler(getInterviewReports)
);

interviewRouter.get(
    "/:reportId",
    asyncHandler(requireAuth),
    asyncHandler(getInterviewReportById)
);

interviewRouter.get(
    "/:reportId/resume",
    asyncHandler(requireAuth),
    asyncHandler(downloadTailoredResume)
);

module.exports = interviewRouter;