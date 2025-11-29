import express from "express";
import convertToJSON from "../services/llm.service.js";
import validation from "../utils/validation.js";
const app = express();
const { validateInputParams, authenticateUser } = validation;
app.get("/", (req, res) => {
  res.send("Restaurant Finder AI Server is running");
});

app.get(
  "/api/execute",
  validateInputParams,
  authenticateUser,
  async (req, res) => {
    try {
      const message = req.query.message as string;
      const code = req.query.code as string;

      console.log("mesage", message);
      console.log("code", code);

      const data = await convertToJSON(message);

      res.json(data);
    } catch (error) {
      console.error("Error fetching LLM response:", error);
      res.status(400).json(error);
    }
  }
);

export default app;
