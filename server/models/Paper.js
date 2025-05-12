const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');
const Subject = require('./Subject');

const Paper = sequelize.define('Paper', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

User.hasMany(Paper);
Paper.belongsTo(User);

Subject.hasMany(Paper);
Paper.belongsTo(Subject);

module.exports = Paper;
