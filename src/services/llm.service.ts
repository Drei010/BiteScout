import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { placeSearchDataSchema } from "../types/index.js";
const apiKey = process.env.OPENAI_API_KEY;

const client = new OpenAI({
  apiKey: apiKey,
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

const convertToJSON = async (userInput: string) => {
  const openaiResponse = await client.responses.parse({
    model: "gpt-4o-2024-08-06",
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
  try {
    const response = openaiResponse.output_parsed;
    if (!response) {
      throw new Error("LLM returned no parsed output");
    }
    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to call LLM provider: ${errorMessage}`);
  }
};
export default convertToJSON;
