const sequelize = require("./sequelize");
const User = require("./user");
const Summary = require("./summary");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");
    await sequelize.sync(); 

    console.log("📦 All models synced");
  } catch (error) {
    console.error("❌ Sequelize error:", error);
  }
})();

module.exports = { sequelize, User, Summary };
