const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const programRoutes = require("./routes/programRoutes");
const userRoutes = require("./routes/userRoutes");

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "*",
  credentials: true,
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api", programRoutes);
app.use("/api/user", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    error: "InternalServerError", 
    message: "Something went wrong",
    details: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));