import { Sequelize } from 'sequelize';
import path from 'path';

import { initUserModel, User } from './User';
import { initSubjectModel, Subject } from './Subject';
import { initPaperModel, Paper } from './Paper';
import { initClubModel, Club } from './Club';
import { initUserClubModel, UserClub } from './UserClub';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

initUserModel(sequelize);
initSubjectModel(sequelize);
initPaperModel(sequelize);
initClubModel(sequelize);
initUserClubModel(sequelize);

User.hasMany(Paper, { foreignKey: 'userId' });
Paper.belongsTo(User, { foreignKey: 'userId' });

Subject.hasMany(Paper, { foreignKey: 'subjectId' });
Paper.belongsTo(Subject, { foreignKey: 'subjectId' });

Club.hasMany(Paper, { foreignKey: 'clubId' });
Paper.belongsTo(Club, { foreignKey: 'clubId' });

User.belongsToMany(Club, { through: UserClub, foreignKey: 'userId' });
Club.belongsToMany(User, { through: UserClub, foreignKey: 'clubId' });

export {
  sequelize,
  User,
  Subject,
  Paper,
  Club,
  UserClub,
};
