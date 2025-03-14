import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors'
import { verifyJWT } from "./src/middleware/auth.middleware.js";
import { connectDB, isDBConnected } from "./src/db/db.js";

const app = express();

app.get("/", (req, res) => {
    res.json({ databaseConnected: isDBConnected });
});

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.use(express.json());
app.use(cors({
  origin: process.env.ORIGIN
}));


import webSeriesRouter from "./src/routes/webSeries.router.js";
import userRouter from "./src/routes/user.router.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/WebSeries", verifyJWT, webSeriesRouter);

app.listen(3000, async () => {
  try {
    await connectDB();
    console.log("Server is running on http://localhost:3000");
  } catch (error) {
    console.error(error)
  }
});
