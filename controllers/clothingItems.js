const Item = require("../models/clothingItems");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail(new Error("NotFound"))
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFound") {
        return res.status(404).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem };
