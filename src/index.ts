import express from "express";
import cors from "cors";
import connectTodb from "./db";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import { globalErrorHandler } from "./utils/errorHandler";

dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

connectTodb(process.env.MONGO_URI);

// Define a simple route
app.use("/users", userRouter);

// Global Error Handling
app.use(globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
