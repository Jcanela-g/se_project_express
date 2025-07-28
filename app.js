const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors: celebrateErrors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const apiLimiter = require("./middlewares/rateLimiter");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use(apiLimiter);
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);
app.use(celebrateErrors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
