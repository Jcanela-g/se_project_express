const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  login,
} = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

module.exports = router;
