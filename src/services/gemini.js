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
    You are a professional editor and formatter.
    Your task is to refine the following text by fixing typos and improving formatting using Markdown, while STRICTLY preserving the original content and structure.
    
    Strict Rules:
    1. **Correction**: Fix typos and grammatical errors, but DO NOT change the original meaning or tone.
    2. **No Structuring Changes**: ABSOLUTELY DO NOT convert narrative text into bullet points or lists. Keep the original paragraph structure exactly as is.
    3. **No Summarization**: ABSOLUTELY DO NOT summarize, condense, or shorten the content. Preserve all details.
    4. **Formatting**: Use Markdown to enhance readability:
       - Use **bold** or *italic* for emphasis on key terms.
       - Use headings (#, ##) only if the text clearly implies a section structure.
    5. **Images**: Detect image URLs (starting with http/https and ending in image extensions) and convert them to Markdown image syntax: ![Image](URL).
    6. **Code**: Format code blocks with triple backticks and language identifiers.
    7. **Output**: Return ONLY the formatted Markdown. Do not add any conversational filler.

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
