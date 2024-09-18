import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import helmet from "helmet"; // Import helmet for security headers

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MONGODB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Security headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://apis.google.com", // For Google OAuth
        "https://www.gstatic.com", // For Google scripts and styles
        "https://www.googleapis.com", // For Google APIs
        "https://identitytoolkit.googleapis.com", // For Firebase Authentication
      ],
      connectSrc: [
        "'self'",
        "https://www.googleapis.com", // For Google APIs
        "https://identitytoolkit.googleapis.com", // For Firebase Authentication
        "https://firebasestorage.googleapis.com", // For Firebase Storage
        "https://*.firebaseio.com", // For Firebase Realtime Database (if used)
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://firebasestorage.googleapis.com", // For Firebase Storage
        "https://www.gstatic.com", // For Google images
      ],
      frameAncestors: ["'none'"], // Adjust based on your requirements
      // Add other directives as needed
    },
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
