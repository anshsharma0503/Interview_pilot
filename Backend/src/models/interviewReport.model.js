const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        preparationTip: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        _id: false
    }
);

const interviewReportSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        jobDescription: {
            type: String,
            required: true
        },

        selfDescription: {
            type: String,
            required: true
        },

        resumeFileName: {
            type: String,
            required: true
        },

        resumeText: {
            type: String,
            required: true,
            select: false
        },
        tailoredResume: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
            select: false
        },

        matchScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        summary: {
            type: String,
            required: true
        },

        strengths: {
            type: [String],
            default: []
        },

        skillGaps: {
            type: [String],
            default: []
        },

        interviewQuestions: {
            type: [interviewQuestionSchema],
            default: []
        },

        preparationPlan: {
            type: [String],
            default: []
        },

        resumeSuggestions: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

interviewReportSchema.index({
    createdBy: 1,
    createdAt: -1
});

interviewReportSchema.set("toJSON", {
    transform(document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();

        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.resumeText;
    }
});

const InterviewReport = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);

module.exports = InterviewReport;