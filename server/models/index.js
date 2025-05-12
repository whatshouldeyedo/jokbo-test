const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'), // DB 파일 생성 위치
  logging: false, // 콘솔에 SQL 쿼리 출력 끄기
});

module.exports = sequelize;
