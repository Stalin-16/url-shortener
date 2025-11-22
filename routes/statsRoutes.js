const express = require("express");
const {
  getShortCodeDetailsByID,
  deleteShortCodeByID,
} = require("../controller/statsService");
const router = express.Router();

router.get("/code/:code", getShortCodeDetailsByID);

router.delete("/:code", deleteShortCodeByID);

module.exports = router;
