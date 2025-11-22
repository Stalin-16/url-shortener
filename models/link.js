const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Link = sequelize.define(
  "Link",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shortCode: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[A-Za-z0-9]{6,8}$/,
      },
    },
    targetUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    totalClicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastClicked: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "links",
    timestamps: true,
  }
);

module.exports = Link;
