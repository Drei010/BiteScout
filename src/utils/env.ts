import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load .env file only in development 
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  dotenv.config();
} else if (process.env.NODE_ENV !== "production") {
  console.warn(`.env file not found at ${envPath}`);
}

const requiredEnvVars = [
  "FOURSQUARE_API_KEY",
  "OPENAI_API_KEY",
  "ACCESS_CODE",
];

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value || value.trim() === "") {
    throw new Error(`Environment variable ${envVar} is required and cannot be empty`);
  }
}
