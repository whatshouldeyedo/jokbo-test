import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

import Paper from '../models/Paper';
import SubjectModel from '../models/Subject';
import User from '../models/User';

const router = express.Router();
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res): Promise<void> => {
  const { subjectId, description } = req.body;
  const auth = req.headers.authorization;

  if (!auth) {
    res.status(401).json({ message: '로그인이 필요합니다' });
    return;
  }

  try {
    const token = auth.split(' ')[1];
    if (!SECRET_KEY) {
      throw new Error('SECRET_KEY is not defined in the environment variables');
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('decoded:', decoded); //
    if (typeof decoded !== 'object' || !('id' in decoded)) {
      res.status(403).json({ message: '유효하지 않은 토큰' });
      return;
    }
    const user = await User.findByPk(decoded.id) as InstanceType<typeof User> & { id: number };
    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const subject = await SubjectModel.findByPk(subjectId) as InstanceType<typeof SubjectModel> & { id: number };
    if (!subject) {
      res.status(404).json({ message: '과목 없음' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
      return;
    }

    const paper = await Paper.create({
      filename: req.file.filename,
      description,
      UserId: user.id,
      SubjectId: subject.id,
    });

    res.json({ message: '업로드 완료', paper });
    return;
  } catch (err: any) {
    console.error('JWT VERIFY ERROR:', err); //
    res.status(403).json({ message: '유효하지 않은 요청', error: err.message });
    return;
  }
});

router.get('/subject/:subjectId', async (req, res) => {
  const { subjectId } = req.params;
  try {
    const papers = await Paper.findAll({
      where: { SubjectId: subjectId },
      include: ['User'],
      order: [['createdAt', 'DESC']],
    });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: '데이터를 불러오는 중 오류 발생' });
  }
});



export default router;