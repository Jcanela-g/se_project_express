const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND, NOT_FOUND_MESSAGE } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: NOT_FOUND_MESSAGE });
});

module.exports = router;
