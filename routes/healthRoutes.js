const express = require("express");
const { sequelize } = require("../models");
const router = express.Router();

const startTime = new Date();

router.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();

    res.status(200).json({
      ok: true,
      version: "1.0",
      uptime: process.uptime(),
      timestamp: startTime.toISOString(),
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      version: "1.0",
      error: "Database connection failed",
    });
  }
});

module.exports = router;
