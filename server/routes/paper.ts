import express, { Request, Response } from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import { Paper, Subject, User } from '../models';

dotenv.config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}

// multer 설정
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

// JWT payload 타입
interface JwtPayload {
  id: number;
  email: string;
  name: string;
}

// 업로드 요청 body 타입
interface UploadBody {
  subjectId: number;
  description?: string;
}

// 파일 업로드 API
router.post(
  '/upload',
  upload.single('file'),
  async (req: Request<{}, {}, UploadBody>, res: Response): Promise<void> => {
    const { subjectId, description } = req.body;
    const auth = req.headers.authorization;

    if (!auth) {
      res.status(401).json({ message: '로그인이 필요합니다' });
      return;
    }

    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

      const user = await User.findByPk(decoded.id);
      if (!user) {
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        return;
      }

      const subject = await Subject.findByPk(subjectId);
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
        userId: user.id,
        subjectId: subject.id,
      });

      res.json({ message: '업로드 완료', paper });
    } catch (err: any) {
      res.status(403).json({ message: '유효하지 않은 요청', error: err.message });
    }
  }
);

// 특정 과목의 논문 리스트 조회
router.get('/subject/:subjectId', async (req: Request<{ subjectId: string }>, res: Response) => {
  const { subjectId } = req.params;

  try {
    const papers = await Paper.findAll({
      where: { subjectId: parseInt(subjectId, 10) },
      include: [User],
      order: [['createdAt', 'DESC']],
    });
    res.json(papers);
  } catch (err: any) {
    res.status(500).json({ message: '데이터를 불러오는 중 오류 발생', error: err.message });
  }
});

export default router;
