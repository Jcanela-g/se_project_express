const router = require("express").Router();

router.get("/users", () => console.log("Get users"));

module.exports = router;
