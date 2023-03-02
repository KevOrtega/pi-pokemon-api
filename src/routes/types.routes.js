const router = require("express").Router();
const { getTypes } = require("../controllers/types.controllers");

router.get("/", getTypes);

module.exports = router;
