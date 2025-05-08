const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DEFAULT_SERVER_ERROR_MESSAGE,
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_SERVER_ERROR_MESSAGE });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((users) => res.status(201).send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_SERVER_ERROR_MESSAGE });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: NOT_FOUND_MESSAGE });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_SERVER_ERROR_MESSAGE });
    });
};

module.exports = { getUsers, createUser, getUser };
