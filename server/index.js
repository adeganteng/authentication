import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { router as authRoute } from "./routes/authRoute.js";

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Routes
app.use("/api/auth", authRoute);

// 3. Mongodb Connection
const DB = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authentication";

mongoose
  .connect(DB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// 4. Global Error Handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// 5. Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
