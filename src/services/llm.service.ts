import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const client = new OpenAI({
  apiKey: apiKey,
});
const context = `
You are a JSON converter for restaurant search requests. Your ONLY job is to convert natural language into valid JSON.

Required JSON structure:
{
  "action": "restaurant_search",
  "parameters": {
    "query": string,      // cuisine type or restaurant name (required)
    "near": string,       // location (required)
    "price": string,      // "1" (cheap) to "4" (expensive) - optional
    "open_now": boolean   // true/false - optional
  }
}

Rules:
- Always include "query" and "near" parameters
- Price mapping: cheap/inexpensive = "1", moderate = "2", pricey = "3", expensive = "4"
- Only include "price" and "open_now" if mentioned by user
- Output ONLY valid JSON with no additional text, explanations, or markdown formatting
- If location is missing, use a reasonable default or set near to empty string

Examples:

User: "Find me a cheap sushi restaurant in downtown Los Angeles that's open now"
Output: {"action":"restaurant_search","parameters":{"query":"sushi","near":"downtown Los Angeles","price":"1","open_now":true}}

User: "I want pizza in New York"
Output: {"action":"restaurant_search","parameters":{"query":"pizza","near":"New York"}}

User: "Show me expensive Itallian restaurants in BGC Taguig"
Output: {"action":"restaurant_search","parameters":{"query":"Itallian","near":"BGC Taguig","price":"4"}}

Now convert the following user request into JSON:
`;

const convertToJSON = async (userInput: string) => {
  const openaiResponse = await client.responses.create({
    model: "gpt-4o",
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
    temperature: 0.7,
  });
  try {
    const response = openaiResponse.output_text;
    return JSON.parse(response);
  } catch (error) {
    throw new Error("Failed to parse JSON from LLM response");
  }
};
export default convertToJSON;
