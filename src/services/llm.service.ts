import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { placeSearchDataSchema } from "../types/index.js";
import type { PlaceSearchData } from "../types/index.js";

const OPENAI_MODEL = "gpt-4o-2024-08-06";
const GROQ_MODEL = "openai/gpt-oss-120b";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const context = `
You are an expert at structured data extraction. Convert to JSON format based on the Examples:
Rules:
- Always include "query" and "near" parameters
- Price mapping: cheap/inexpensive = "1", moderate = "2", pricey = "3", expensive = "4"
- Only include "price" and "open_now" if mentioned by user
- Output ONLY valid JSON with no additional text, explanations, or markdown formatting
- If location is missing, use a reasonable default or set near to empty string

Examples:
User: "Find me a cheap sushi restaurant in downtown Los Angeles that's open now"
Output: {"action":"restaurant_search","parameters":{"query":"sushi","near":"downtown Los Angeles","price":"1","open_now":true}}
User: "I want pizza in Syndey"
Output: {"action":"restaurant_search","parameters":{"query":"pizza","near":"Syndey"}}
User: "Show me expensive Itallian restaurants in BGC Taguig"
Output: {"action":"restaurant_search","parameters":{"query":"Itallian","near":"BGC Taguig","price":"4"}}
`;

const callProvider = async (
  client: OpenAI,
  model: string,
  userInput: string
): Promise<PlaceSearchData> => {
  const response = await client.responses.parse({
    model,
    input: [
      {
        role: "system",
        content: context,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    text: {
      format: zodTextFormat(placeSearchDataSchema, "restaurant_search"),
    },
  });

  const parsed = response.output_parsed;
  if (!parsed) {
    throw new Error("LLM returned no parsed output");
  }
  return parsed;
};

const convertToJSON = async (userInput: string): Promise<PlaceSearchData> => {
  try {
    return await callProvider(openaiClient, OPENAI_MODEL, userInput);
  } catch (openaiError: unknown) {
    const openaiMessage =
      openaiError instanceof Error ? openaiError.message : String(openaiError);
    console.warn(
      `OpenAI failed, falling back to Groq: ${openaiMessage}`
    );

    try {
      return await callProvider(groqClient, GROQ_MODEL, userInput);
    } catch (groqError: unknown) {
      const groqMessage =
        groqError instanceof Error ? groqError.message : String(groqError);
      throw new Error(
        `All LLM providers failed. OpenAI: ${openaiMessage} | Groq: ${groqMessage}`
      );
    }
  }
};

export default convertToJSON;
