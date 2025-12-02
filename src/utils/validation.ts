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

 if (!action) {
    return {
      error: 'LLM output validation failed',
      message: 'LLM response missing required field: action',
    };
  }
  
  if (typeof action !== 'string' || action.trim() === '') {
    return {
      error: 'LLM output validation failed',
      message: 'LLM response has invalid action: must be a non-empty string',
    };
  }
  
  if (!parameters) {
    return {
      error: 'LLM output validation failed',
      message: 'LLM response missing required field: parameters',
    };
  }
  
  if (typeof parameters !== 'object' || Array.isArray(parameters)) {
    return {
      error: 'LLM output validation failed',
      message: 'LLM response has invalid parameters: must be an object',
    };
  }
  
  const { query, near, min_price, open_now } = parameters;
  
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return {
      error: 'LLM output validation failed',
      message: 'LLM response missing or has invalid parameter: query (must be a non-empty string)',
    };
  }
  
  if (!near || typeof near !== 'string' || near.trim() === '') {
    return {
      error: 'LLM output validation failed',
      message: 'LLM response missing or has invalid parameter: near (must be a non-empty string)',
    };
  }
  
  if (min_price !== undefined) {
    if (typeof min_price !== 'number' || min_price < 0) {
      return {
        error: 'LLM output validation failed',
        message: 'LLM response has invalid parameter: min_price (must be a non-negative number)',
      };
    }
  }
  
  if (open_now !== undefined && typeof open_now !== 'boolean') {
    return {
      error: 'LLM output validation failed',
      message: 'LLM response has invalid parameter: open_now (must be a boolean)',
    };
  }
  console.log("LLM output validation passed");
  return null;
};

export default { validateInputParams, validateLLMOutput, authenticateUser };
