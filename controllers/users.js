const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).res.send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((users) => res.status(201).res.send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).res.send({ message: err.message });
      }
      return res.status(500).res.send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((users) => res.status(200).res.send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).res.send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).res.send({ message: err.message });
      }
      return res.status(500).res.send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
