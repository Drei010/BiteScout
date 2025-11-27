import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Restaurant Finder AI Server is running");
});

export default app;
