const sequelize = require("../config/dbConfig");
const Link = require("./link");

const models = {
  Link,
};

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
    await sequelize.sync({ force: false });
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  ...models,
  sequelize,
  syncDatabase,
};
