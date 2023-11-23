import express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { router as contactsRouter } from "./routes/api/contacts.js";
import { router as usersRouter } from "./routes/api/users.js";
import dotenv from "dotenv";
import setJWTStrategy from "./strategies/jwt.js";
import authMiddleware from "./middlewares/jwt.js";
dotenv.config();

const { DB_HOST: uriDb } = process.env;

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const connection = mongoose.connect(uriDb);

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

setJWTStrategy();

app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
});

async function startServer() {
  try {
    await connection;
    console.log("Database connection successful");
  } catch (err) {
    console.log("DB not connected, shutting down");
    process.exit(1);
  }
}

startServer();
export default app;
