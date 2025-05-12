import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import authRouter from './routes/auth';
import subjectRouter from './routes/subject';
import paperRouter from './routes/paper';
import sequelize from './models';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'File not uploaded' });
    return;
  }
  res.json({
    savedAs: req.file.filename,
    original: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRouter);
app.use('/subjects', subjectRouter);
app.use('/papers', paperRouter);

sequelize.sync({ alter: true }).then(() => {
  console.log('DB 동기화 완료');
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
  });
});