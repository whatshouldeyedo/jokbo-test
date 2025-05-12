import { DataTypes } from 'sequelize';
import sequelize from './index';

const Subject = sequelize.define('Subject', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Subject;