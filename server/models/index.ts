import { Sequelize } from 'sequelize';
import path from 'path';

import { initUserModel, User } from './User';
import { initSubjectModel, Subject } from './Subject';
import { initPaperModel, Paper } from './Paper';

// Sequelize 인스턴스 생성
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

// 모델 초기화
initUserModel(sequelize);
initSubjectModel(sequelize);
initPaperModel(sequelize);

// 관계 설정
User.hasMany(Paper, { foreignKey: 'userId' });
Paper.belongsTo(User, { foreignKey: 'userId' });

Subject.hasMany(Paper, { foreignKey: 'subjectId' });
Paper.belongsTo(Subject, { foreignKey: 'subjectId' });

export {
  sequelize,
  User,
  Subject,
  Paper,
};
