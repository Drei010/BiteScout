import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const validateInputParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, code } = req.query;
  if (!message || typeof message !== "string" || message.trim() === "") {
    res.status(400).json({
      error: "message parameter is required and cannot be empty.",
    });
    return;
  }
  if (!code || typeof code !== "string" || code.trim() === "") {
    res.status(400).json({
      error: "code parameter is required and cannot be empty.",
    });
    return;
  }
  next();
};

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code as string;

  if (code != process.env.ACCESS_CODE) {
    res.status(400).json({
      Error: "The provided code  is not correct.",
    });
    return;
  }
  next();
};
export default { validateInputParams, authenticateUser };
