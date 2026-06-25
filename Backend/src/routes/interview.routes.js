const express = require("express");

const {
    createInterviewReport,
    getInterviewReports,
    getInterviewReportById
} = require("../controllers/interview.controller");

const { requireAuth } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const interviewRouter = express.Router();

interviewRouter.post(
    "/",
    asyncHandler(requireAuth),
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

module.exports = interviewRouter;