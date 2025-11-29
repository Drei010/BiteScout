import type { Request, Response, NextFunction } from "express";

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
  const accessCode = process.env.ACCESS_CODE;
  if (code !== accessCode) {
    res.status(401).json({
      Error: "The provided code  is not correct.",
    });
    return;
  }
  next();
};
export default { validateInputParams, authenticateUser };
