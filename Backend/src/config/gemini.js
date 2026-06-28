const { GoogleGenAI } = require("@google/genai");

const geminiClient = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

module.exports = geminiClient;