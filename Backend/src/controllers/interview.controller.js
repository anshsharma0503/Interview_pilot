const { PDFParse } = require("pdf-parse");

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

    const mockReport = {
        id: `mock-${Date.now()}`,
        title: "Mock Interview Report",
        matchScore: 72,
        summary:
            "Your resume was uploaded and processed successfully. Gemini analysis will be added later.",

        resumeInfo: {
            fileName: req.file.originalname,
            fileSize: req.file.size,
            extractedCharacters: resumeText.length,
            preview: resumeText.slice(0, 200)
        },

        receivedInput: {
            jobDescription,
            selfDescription
        },

        createdBy: req.user.id,
        createdAt: new Date().toISOString()
    };

    return res.status(201).json({
        success: true,
        message: "Interview report created successfully",
        data: {
            report: mockReport
        }
    });
}

async function getInterviewReports(req, res) {
    return res.status(200).json({
        success: true,
        message: "Interview reports fetched successfully",
        data: {
            reports: []
        }
    });
}

async function getInterviewReportById(req, res) {
    const { reportId } = req.params;

    return res.status(200).json({
        success: true,
        message: "Interview report fetched successfully",
        data: {
            report: {
                id: reportId,
                title: "Mock Interview Report",
                matchScore: 72,
                summary:
                    "This is a placeholder report detail response. Later this will come from MongoDB.",
                createdBy: req.user.id,
                createdAt: new Date().toISOString()
            }
        }
    });
}

module.exports = {
    createInterviewReport,
    getInterviewReports,
    getInterviewReportById
};