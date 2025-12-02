import type { PlaceSearchData } from "../types/index.js";
import type { Request, Response, NextFunction } from "express";
import type { ErrorResponse } from "../types/index.js";

const validateInputParams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { message, code } = req.query;
  if (!message || typeof message !== "string" || message.trim() === "") {
    res.status(400).json({
      error: "InvalidRequest",
      message: "message parameter is required and cannot be empty.",
    } as ErrorResponse);
    return;
  }
  if (!code || typeof code !== "string" || code.trim() === "") {
    res.status(400).json({
      error: "InvalidRequest",
      message: "code parameter is required and cannot be empty.",
    } as ErrorResponse);
    return;
  }
  next();
};

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const code = req.query.code as string;
  const accessCode = process.env.ACCESS_CODE;
  if (code !== accessCode) {
    res.status(401).json({
      error: "AuthenticationError",
      message: "The provided code  is not correct.",
    } as ErrorResponse);
    return;
  }
  next();
};

const validateLLMOutput = (data: PlaceSearchData): ErrorResponse | null => {
  const { action, parameters } = data;

  if (action.trim() === "") {
    return {
      error: "LLM output validation failed",
      message: "LLM response has invalid action: must be a non-empty string",
    };
  }

  const { query, near } = parameters;

  if (!query || typeof query !== "string" || query.trim() === "") {
    return {
      error: "LLM output validation failed",
      message:
        "The LLM cannot process the requested cuisine or place. Please try again with a different query.",
    };
  }

  if (!near || typeof near !== "string" || near.trim() === "") {
    return {
      error: "LLM output validation failed",
      message:
        "The LLM cannot process the current location. Please provide a specific location.",
    };
  }

  return null;
};

export default { validateInputParams, validateLLMOutput, authenticateUser };
