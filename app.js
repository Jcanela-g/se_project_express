const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "681968c24baf5fcdb16cde49",
  };
  next();
});
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
