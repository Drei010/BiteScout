import app from "./routes/execute";

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  console.log("Running in development mode");
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
