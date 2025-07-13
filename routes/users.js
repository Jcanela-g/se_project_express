const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");
const {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
} = require("../controllers/users");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);
router.use(auth);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", validateUserBody, updateCurrentUser);

module.exports = router;
