import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import { sequelize } from './models';
import authRouter from './routes/auth';
import subjectRouter from './routes/subject';
import paperRouter from './routes/paper';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// uploads 디렉토리 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 정적 파일 제공
app.use('/uploads', express.static(uploadDir));

// 라우터 등록
app.use('/auth', authRouter);
app.use('/subjects', subjectRouter);
app.use('/papers', paperRouter);

// 서버 실행
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('DB 동기화 완료');
    app.listen(PORT, () => {
      console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
    });
  })
  .catch((err: Error) => {
    console.error('DB 동기화 실패:', err.message);
  });
