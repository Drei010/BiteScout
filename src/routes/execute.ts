import type { Express } from "express";
import convertToJSON from "../services/llm.service.js";
import callPlaceSearch from "../services/foursquare.service.js";
import validation from "../utils/validation.js";
import { InternalServerError } from "openai";

const { validateInputParams, authenticateUser } = validation;

export default function setupRoutes(app: Express) {
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
        const llmResult = await convertToJSON(message);
        const apiResult = await callPlaceSearch(llmResult)
        res.json(apiResult);
      } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json(`InternalServerError: ${error instanceof Error ? error.message : 'Unknown error'} `);
      }
    }
  );
}
