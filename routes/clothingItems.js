const router = require("express").Router();

router.get("/", () => console.log("Get items"));
router.post("/", () => console.log("Post item"));
router.delete("/:itemId", () => console.log("Delete item by id"));

module.exports = router;
