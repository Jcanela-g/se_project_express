const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
  DEFAULT_SERVER_ERROR_MESSAGE,
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  EMAIL_CONFLICT_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const conflictError = new Error(EMAIL_CONFLICT_MESSAGE);
        conflictError.status = CONFLICT;
        return Promise.reject(conflictError);
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }));
    })
    .then((newUser) =>
      res.status(201).send({
        _id: newUser._id,
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.status === CONFLICT) {
        return res.status(CONFLICT).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: EMAIL_CONFLICT_MESSAGE });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_SERVER_ERROR_MESSAGE });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
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

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Invalid email or password") {
        return res.status(UNAUTHORIZED).send({ message: UNAUTHORIZED_MESSAGE });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: DEFAULT_SERVER_ERROR_MESSAGE });
    });
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      }
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

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
