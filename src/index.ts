import app from "./routes/execute.js";

// Only start the server if not in a serverless environment
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
