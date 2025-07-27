const { DataTypes, Sequelize } = require("sequelize"); 
const sequelize = require("./sequelize");


const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    daily_usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    daily_reset_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  { timestamps: true }
);

module.exports = User;
