import { DataTypes } from 'sequelize';
import sequelize from './index';
import User from './User';
import Subject from './Subject';

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

export default Paper;
