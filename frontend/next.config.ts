import path from "path";
import dotenv from "dotenv";
import type { NextConfig } from "next";

dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });

const nextConfig: NextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    ACCESS_CODE: process.env.ACCESS_CODE,
  },
};

export default nextConfig;
