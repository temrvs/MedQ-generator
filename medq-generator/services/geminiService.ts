
import { GoogleGenAI, Type } from "@google/genai";
import { MCQConfig, GeneratedQuestion, ValidationResponse, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-3-pro-preview";

export const validateMCQConfig = async (config: MCQConfig): Promise<ValidationResponse> => {
  const objectiveText = config.objective && config.objective.trim().length > 0 
    ? config.objective 
    : `General knowledge of ${config.topics.join(", ")} related to ${config.organSystem}`;

  const prompt = `
    Act as a medical education consultant. 
    Review the following MCQ configuration parameters for pedagogical alignment:
    1. **Learning Objective (LO)**: "${objectiveText}"
    2. **Bloom's Taxonomy Level**: ${config.bloomLevel}
    Return result strictly as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 1024 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            title: { type: Type.STRING },
            message: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ["isValid", "title", "message", "advice"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ValidationResponse;
    }
    throw new Error("No validation response received.");
  } catch (error) {
    console.error("Error validating config:", error);
    return { isValid: true, title: "", message: "", advice: "" };
  }
};

export const generateMCQs = async (config: MCQConfig): Promise<GeneratedQuestion[]> => {
  const subTopicsInstruction = config.subTopics.length > 0
    ? `3. **Professional Competencies/Subtopics**: ${config.subTopics.join(", ")}. Integrate these applied concepts into the question stem or options.`
    : `3. **Professional Competencies**: Automatically select relevant medical concepts (e.g., Clinical Correlation).`;

  const stemInstruction = config.hasClinicalStem 
    ? `4. **Question Format**: Must use a Clinical Stem (Vignette). Present a patient case with demographic data, symptoms, physical findings, and/or labs.`
    : `4. **Question Format**: Direct science question. No clinical vignette required.`;

  const searchInstruction = config.useLiveSearch 
    ? `IMPORTANT: Use Google Search to verify the latest 2024-2025 clinical guidelines, diagnostic criteria, and management protocols. Ensure the question reflects current EBM standards.`
    : "";

  const prompt = `
    You are an expert medical education consultant.
    Create ${config.numberOfQuestions} MCQs based on:
    1. **Science Topics**: ${config.topics.join(", ")}.
    2. **Organ System**: ${config.organSystem}.
    ${subTopicsInstruction}
    ${stemInstruction}
    5. **Options**: ${config.numberOfOptions}.
    6. **Bloom Level**: ${config.bloomLevel}.
    7. **Target Difficulty (Angoff Index)**: ${config.angoffIndex} (decimal probability scale: 0.8 is easy, 0.2 is very hard).
    8. **Objective**: ${config.objective || "General knowledge"}.
    ${searchInstruction}

    Rules:
    - Use standard newlines (\\n).
    - No HTML tags.
    - Output must be a valid JSON array of objects.
  `;

  try {
    const generationConfig: any = {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4096 },
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            predictedAngoff: { type: Type.NUMBER },
            bloomLevel: { type: Type.STRING },
            topicTag: { type: Type.STRING }
          },
          required: ["questionText", "options", "correctAnswerIndex", "explanation", "predictedAngoff", "bloomLevel", "topicTag"],
        },
      },
    };

    if (config.useLiveSearch) {
      generationConfig.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: generationConfig,
    });

    if (response.text) {
      const questions = JSON.parse(response.text) as GeneratedQuestion[];
      
      const sources: GroundingSource[] = [];
      const metadata = response.candidates?.[0]?.groundingMetadata;
      if (metadata?.groundingChunks) {
        metadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            sources.push({
              uri: chunk.web.uri,
              title: chunk.web.title || "External Source"
            });
          }
        });
      }

      if (config.useLiveSearch && sources.length > 0) {
        return questions.map(q => ({ ...q, sources: sources.slice(0, 5) }));
      }

      return questions;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Error generating MCQs:", error);
    throw error;
  }
};
