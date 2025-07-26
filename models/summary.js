const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const User = require('./user');

const Summary = sequelize.define(
  'Summary',
  {
    original_text: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    summary_text: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    tone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    length: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    original_word_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    summary_word_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true }
);

// Set up association
User.hasMany(Summary, { foreignKey: 'user_id' });
Summary.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Summary;