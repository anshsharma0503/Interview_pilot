const { PDFParse } = require("pdf-parse");
const InterviewReport = require("../models/interviewReport.model");
const {
    generateInterviewReport,
    generateTailoredResume
} = require("../services/gemini.service");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const { buildResumeHtml } = require("../utils/resumeTemplate");

async function createInterviewReport(req, res) {
    const { jobDescription, selfDescription } = req.body;

    if (!jobDescription || !selfDescription) {
        return res.status(400).json({
            success: false,
            message: "Job description and self description are required"
        });
    }

    if (jobDescription.trim().length < 50) {
        return res.status(400).json({
            success: false,
            message: "Job description should be at least 50 characters"
        });
    }

    if (selfDescription.trim().length < 30) {
        return res.status(400).json({
            success: false,
            message: "Self description should be at least 30 characters"
        });
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please upload your resume as a PDF"
        });
    }

    const parser = new PDFParse({
        data: req.file.buffer
    });

    let resumeText;

    try {
        const result = await parser.getText();
        resumeText = result.text.trim();
    } finally {
        await parser.destroy();
    }

    if (!resumeText) {
        return res.status(400).json({
            success: false,
            message: "No readable text was found in the resume"
        });
    }

    const generatedReport = await generateInterviewReport({
        resumeText,
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim()
    });

    const savedReport = await InterviewReport.create({
        createdBy: req.user.id,
        title: generatedReport.title,
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
        resumeFileName: req.file.originalname,
        resumeText,
        matchScore: generatedReport.matchScore,
        summary: generatedReport.summary,
        strengths: generatedReport.strengths,
        skillGaps: generatedReport.skillGaps,
        interviewQuestions: generatedReport.interviewQuestions,
        preparationPlan: generatedReport.preparationPlan,
        resumeSuggestions: generatedReport.resumeSuggestions
    });

    return res.status(201).json({
        success: true,
        message: "Interview report generated successfully",
        data: {
            report: savedReport
        }
    });
}

async function getInterviewReports(req, res) {
    const reports = await InterviewReport.find({
        createdBy: req.user.id
    }).sort({
        createdAt: -1
    });

    return res.status(200).json({
        success: true,
        message: "Interview reports fetched successfully",
        data: {
            reports
        }
    });
}

async function getInterviewReportById(req, res) {
    const { reportId } = req.params;

    if (!mongoose.isValidObjectId(reportId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid report ID"
        });
    }

    const report = await InterviewReport.findOne({
        _id: reportId,
        createdBy: req.user.id
    });

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Interview report not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "Interview report fetched successfully",
        data: {
            report
        }
    });
}

async function downloadTailoredResume(req, res) {
    const { reportId } = req.params;

    if (!mongoose.isValidObjectId(reportId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid report ID"
        });
    }

    const report = await InterviewReport.findOne({
        _id: reportId,
        createdBy: req.user.id
    }).select("+resumeText +tailoredResume");

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Interview report not found"
        });
    }

    let tailoredResume = report.tailoredResume;

    if (!tailoredResume) {
        tailoredResume = await generateTailoredResume({
            resumeText: report.resumeText,
            jobDescription: report.jobDescription,
            selfDescription: report.selfDescription
        });

        report.tailoredResume = tailoredResume;
        report.markModified("tailoredResume");

        await report.save();
    }

    const resumeHtml = buildResumeHtml(tailoredResume);

    const browser = await puppeteer.launch({
        headless: true
    });

    try {
        const page = await browser.newPage();

        await page.setContent(resumeHtml, {
            waitUntil: "domcontentloaded"
        });

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="tailored-resume.pdf"'
        );

        return res.send(Buffer.from(pdf));
    } finally {
        await browser.close();
    }
}

module.exports = {
    createInterviewReport,
    getInterviewReports,
    getInterviewReportById,
    downloadTailoredResume
};