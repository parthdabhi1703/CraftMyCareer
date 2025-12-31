import { CONFIG } from './config.js';

const API_KEY = CONFIG.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export const GeminiService = {

    // Helper to make the fetch request
    async callGemini(promptText) {
        try {
            // MOCK RESPONSE if no key is provided (for safe viva demo)
            if (API_KEY === "YOUR_GEMINI_API_KEY") {
                console.warn("Using Mock Data - No API Key set");
                await new Promise(r => setTimeout(r, 1500)); // Simulate delay
                return { text: "Mock AI Response: Please add a valid API key to geminiServices.js to see real generative results." };
            }

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }]
                })
            });

            const data = await response.json();
            return { text: data.candidates[0].content.parts[0].text };

        } catch (error) {
            console.error("AI Service Error:", error);
            return { error: "Failed to connect to AI service." };
        }
    },

    // Enhances a professional summary based on role.
    async enhanceSummary(currentSummary, role) {
        const prompt = `
            Act as an expert resume writer. 
            Role: ${role}.
            Task: Rewrite the following summary to be professional, ATS-friendly, and result-oriented. 
            Keep it under 60 words.
            Current Summary: "${currentSummary}"
            Output ONLY the rewritten summary text. Do not include "Here is an option" or labels like "Option 1". Just the text.
        `;
        return await this.callGemini(prompt);
    },

    // Generates bullet points for Experience or Projects.
    async generateBulletPoints(role, context, type) {
        const prompt = `
            Act as an expert resume writer. 
            Role: ${role}.
            Context: ${context}.
            Task: Generate 3 impactful, result-oriented bullet points for this ${type}. 
            Use strong action verbs. 
            Output ONLY the 3 sentences, separated by newlines. 
            Do NOT use bullet characters (•), dashes, or numbers at the start of the lines. Just the text.
            Do not include introductory text or options.
        `;
        return await this.callGemini(prompt);
    },

    // Generates a one-line description for a Certification.
    async enhanceCertification(title, currentDescription) {
        const prompt = `
            Act as an expert resume writer.
            Task: Write exactly ONE impactful line about what was learned or achieved from the certification titled "${title}".
            Context: ${currentDescription || "No description provided"}.
            Output ONLY the one sentence. Do not use bullet points.
        `;
        return await this.callGemini(prompt);
    },

    // Recommends skills based on role.
    async recommendSkills(role) {
        const prompt = `
            Act as an expert career coach.
            Role: ${role}.
            Task: List 20 key technical skills for this role.
            Output ONLY the skills as a comma-separated list.
            Do not use bullet points or numbering.
        `;
        return await this.callGemini(prompt);
    },

    // Generates ATS Score and Suggestions
    async getATSReview(resumeData) {
        const prompt = `
            Analyze this resume data for a ${resumeData.role} role.
            Data: ${JSON.stringify(resumeData)}.
            Output format: JSON only.
            Structure: { "score": number (0-100), "missing_keywords": [], "suggestion": "" }
            Do not output markdown code blocks, just raw JSON string.
        `;
        return await this.callGemini(prompt);
    }
};