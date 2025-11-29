import type { Express } from "express";
import convertToJSON from "../services/llm.service.js";
import callPlaceSearch from "../services/foursquare.service.js";
import validation from "../utils/validation.js";

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
        const code = req.query.code as string;

        console.log("mesage", message);
        console.log("code", code);

        const data = await convertToJSON(message);
        // console.log("data", callPlaceSearch(data));
        res.json(data);
      } catch (error) {
        console.error("Error fetching LLM response:", error);
        res.status(500).json(error);
      }
    }
  );
}
