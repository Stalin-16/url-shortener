require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const { syncDatabase } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);
app.set("layout", "layout");

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/stats", require("./routes/statsRoutes"));
app.use("/healthz", require("./routes/healthRoutes"));
app.use("/", require("./routes/indexRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Initialize database and start server
const startServer = async () => {
  try {
    await syncDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
