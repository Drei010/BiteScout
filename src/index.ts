import dotenv from "dotenv";
dotenv.config();

import express from "express";
import executeRoutes from "./routes/execute.js";

const app = express();
executeRoutes(app);

// Only start the server if not in a serverless environment
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
