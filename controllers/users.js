const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  EMAIL_CONFLICT_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return next(new BadRequestError(BAD_REQUEST_MESSAGE));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError(EMAIL_CONFLICT_MESSAGE);
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
      if (err.name === "ValidationError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }
      if (err.code === 11000) {
        return next(new ConflictError(EMAIL_CONFLICT_MESSAGE));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(NOT_FOUND_MESSAGE));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError(BAD_REQUEST_MESSAGE));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Invalid email or password") {
        return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE));
      }
      next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(NOT_FOUND_MESSAGE));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
