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
import clubRouter from './routes/club';

dotenv.config();

const app = express();
import asyncHandler from 'express-async-handler';
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: 'https://sori.newbie.sparcs.me',
  credentials: true
}));

app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use('/auth', authRouter);
app.use('/subjects', subjectRouter);
app.use('/papers', paperRouter);
app.use('/clubs', clubRouter);

sequelize
  .sync({alter: true})
  .then(() => {
    console.log('DB 동기화 완료');
    app.listen(PORT, () => {
      console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
    });
  })
  .catch((err: Error) => {
    console.error('DB 동기화 실패:', err);
  });
