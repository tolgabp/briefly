const sequelize = require('./sequelize');
const User = require('./user');
const Summary = require('./summary');

// Test DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync({ alter: true });
    console.log('📦 All models synced');
  } catch (error) {
    console.error('❌ Sequelize error:', error);
  }
})();

module.exports = { sequelize, User, Summary };