const { validationResult } = require("express-validator");
const Link = require("../models/link");
const { generateShortCode } = require("../utils/utils");

const createShotLinks = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { targetUrl, customCode } = req.body;
    let shortCode = customCode;

    // Generate random code if no custom code provided
    if (!shortCode) {
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 5) {
        shortCode = generateShortCode();
        const existing = await Link.findOne({ where: { shortCode } });
        if (!existing) isUnique = true;
        attempts++;
      }

      if (!isUnique) {
        return res
          .status(500)
          .json({ error: "Failed to generate unique short code" });
      }
    } else {
      // Check if custom code already exists
      const existing = await Link.findOne({ where: { shortCode } });
      if (existing) {
        return res.status(409).json({ error: "Short code already exists" });
      }
    }

    const link = await Link.create({
      shortCode,
      targetUrl,
    });

    res.status(201).json({
      shortCode: link.shortCode,
      targetUrl: link.targetUrl,
      shortUrl: `${process.env.BASE_URL}/${link.shortCode}`,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCodesByIdAndRedirect = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ where: { shortCode: code } });

    if (!link) {
      return res.status(404).render("404");
    }

    // Update click stats
    link.totalClicks += 1;
    link.lastClicked = new Date();
    await link.save();

    res.redirect(302, link.targetUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).render("error", { message: "Internal server error" });
  }
};

const getAllLinks = async (req, res) => {
  try {
    const links = await Link.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.render("dashboard", {
      links,
      baseUrl: process.env.BASE_URL,
      title: "Dashboard - URL Shortener",
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("error", { message: "Internal server error" });
  }
};

const deletLinksByIDcode = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ where: { shortCode: code } });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    await link.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createShotLinks,
  getCodesByIdAndRedirect,
  getAllLinks,
  deletLinksByIDcode,
};
