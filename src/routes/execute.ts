import express from "express";
import convertToJSON from "../services/llm.service.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Restaurant Finder AI Server is running");
});

app.post("/testing", async (req, res) => {
  try {
    const data = await convertToJSON(
      "Find me a cheap sushi restaurant in downtown Los Angeles that's open now"
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching LLM response:", error);
    res.status(500).json({ error: "Failed to get response from LLM" });
  }
});

export default app;
