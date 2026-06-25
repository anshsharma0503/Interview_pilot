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

    const mockReport = {
        id: `mock-${Date.now()}`,
        title: "Mock Interview Report",
        matchScore: 72,
        summary:
            "This is a temporary response. Later, Gemini will generate a real interview report.",
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