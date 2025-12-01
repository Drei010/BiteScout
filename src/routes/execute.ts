import type { Request, Response, Express } from "express";
import convertToJSON from "../services/llm.service.js";
import callPlaceSearch from "../services/foursquare.service.js";
import validation from "../utils/validation.js";
import type { ErrorResponse } from "../types/index.js";

const { validateInputParams, authenticateUser } = validation;

export default function setupRoutes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.send("Restaurant Finder AI Server is running");
  });

  app.get(
    "/api/execute",
    validateInputParams,
    authenticateUser,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const message = req.query.message as string;
        const llmResult = await convertToJSON(message);
        const apiResult = await callPlaceSearch(llmResult);
        res.json(apiResult);
      } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({
          error: "InternalServerError",
          message: error instanceof Error ? error.message : "Unknown error",
        } as ErrorResponse);
      }
    }
  );
}
