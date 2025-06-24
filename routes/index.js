const router = require("express").Router();

const itemRouter = require("./clothingItems");
const userRouter = require("./users");

const { NOT_FOUND, NOT_FOUND_MESSAGE } = require("../utils/errors");

router.use("/items", itemRouter);
router.use("/", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: NOT_FOUND_MESSAGE });
});

module.exports = router;
