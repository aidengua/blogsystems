import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

const MODELS_TO_TRY = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest"
];

export const formatContentWithGemini = async (content) => {
    if (!genAI) {
        throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const prompt = `
    You are an expert content editor and Markdown formatter.
    Your task is to take the following raw text (which may contain image URLs) and format it into beautiful, structured Markdown.
    
    Rules:
    1. Improve the structure with proper headings (#, ##, ###).
    2. Format lists (bullet points or numbered lists) correctly.
    3. Detect image URLs (starting with http:// or https:// and ending with .jpg, .png, .gif, .webp, etc.) and convert them into Markdown image syntax: ![Alt Text](URL).
    4. Highlight key terms with **bold** or *italic*.
    5. Fix any obvious typos or grammar mistakes (keep the original language, Traditional Chinese).
    6. Do NOT add any conversational filler (e.g., "Here is the formatted text"). Just output the Markdown.
    7. If there are code blocks, format them with triple backticks and the appropriate language.

    Raw Content:
    ${content}
    `;

    let lastError = null;

    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`Attempting to use model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.warn(`Failed with model ${modelName}:`, error);
            lastError = error;
        }
    }

    // If all failed, try to list models to help debug
    try {
        console.log("All attempts failed. Fetching available models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log("Available Models:", data);
        if (data.models) {
            const modelNames = data.models.map(m => m.name.replace('models/', '')).join(', ');
            throw new Error(`All tried models failed. Available models for your key: ${modelNames}`);
        }
    } catch (listError) {
        console.error("Failed to list models:", listError);
    }

    console.error("All Gemini models failed.");
    throw lastError || new Error("Failed to generate content with any available Gemini model.");
};
