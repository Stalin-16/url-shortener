const express = require("express");
const { body } = require("express-validator");
const {
  getAllLinks,
  deletLinksByIDcode,
  createShotLinks,
  getCodesByIdAndRedirect,
} = require("../controller/dashBoardService");
const router = express.Router();

// Validation rules
const createLinkValidation = [
  body("targetUrl")
    .isURL({ require_protocol: true })
    .withMessage("Please provide a valid URL with http:// or https://"),
  body("customCode")
    .optional()
    .matches(/^[A-Za-z0-9]{6,8}$/)
    .withMessage(
      "Custom code must be 6-8 characters and contain only letters and numbers"
    ),
];

// Create short link
router.post("/", createLinkValidation, createShotLinks);

// Redirect short code
router.get("/:code", getCodesByIdAndRedirect);

// Dashboard - List all links
router.get("/", getAllLinks);

router.delete("/:code", deletLinksByIDcode);

module.exports = router;
