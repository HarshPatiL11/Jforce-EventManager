import { PORT } from "./config/config.js";

import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import colors from "colors";
import connectDb from "./DB/db.js";
import userRouter from "./MVC/Router/UserRouter.js";
import EventRouter from "./MVC/Router/EventRouter.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// set router
const router = express.Router();

// test server
app.get("/", (req, res) => {
  res.send(`<h1>hello port ${PORT}</h1>`);
});

router.use("/user", userRouter);
router.use('/event',EventRouter);

app.use("/api/v1", router);
app.get("/api/v1", (req, res) => {
  res.send(`<h1>hello port ${PORT} api/v1</h1>`);
}); //for debugging only

// listen
app.listen(PORT, () => {
  console.log(`Listening to port number ${PORT}`.blue.bgGreen.bold);
});

connectDb();
const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET in server.js:", JWT_SECRET);
