const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Subject = sequelize.define('Subject', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Subject;
