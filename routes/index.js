const router = require("express").Router();

const itemRouter = require("./clothingItems");
const userRouter = require("./users");

const { NOT_FOUND_MESSAGE } = require("../utils/errors");
const NotFoundError = require("../errors/NotFoundError");

router.use("/items", itemRouter);
router.use("/", userRouter);
router.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_MESSAGE));
});

module.exports = router;
