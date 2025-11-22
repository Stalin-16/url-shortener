const Link = require("../models/link");

const getShortCodeDetailsByID = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ where: { shortCode: code } });

    if (!link) {
      return res.status(404).render("404");
    }

    res.render("stats", {
      link,
      baseUrl: process.env.BASE_URL,
      script: "stats",
      title: `Stats ${link.shortCode} - URL Shortener`,
    });
  } catch (error) {
    console.error("Stats page error:", error);
    res.status(500).render("error", { message: "Internal server error" });
  }
};

const deleteShortCodeByID = async (req, res) => {
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
  getShortCodeDetailsByID,
  deleteShortCodeByID,
};
