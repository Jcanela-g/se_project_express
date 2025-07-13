const Item = require("../models/clothingItems");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  FORBIDDEN_MESSAGE,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError(NOT_FOUND_MESSAGE));
      }

      if (item.owner.toString() !== currentUserId) {
        return next(new ForbiddenError(FORBIDDEN_MESSAGE));
      }

      return Item.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).send({ data: deletedItem })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(new NotFoundError(NOT_FOUND_MESSAGE))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(new NotFoundError(NOT_FOUND_MESSAGE))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }
      next(err);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
