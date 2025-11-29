import express from "express";
import convertToJSON from "../services/llm.service.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Restaurant Finder AI Server is running");
});

app.get("/api/execute", async (req, res) => {
  try {
    const message = req.query.message as string;
    const data = await convertToJSON(message);
    res.json(data);
  } catch (error) {
    console.error("Error fetching LLM response:", error);
    res.status(500).json({ error: "Failed to get response from LLM" });
  }
});

export default app;
