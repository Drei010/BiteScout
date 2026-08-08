import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import type { NextConfig } from "next";

const envPath = path.resolve(import.meta.dirname, "../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const nextConfig: NextConfig = {
};

export default nextConfig;
