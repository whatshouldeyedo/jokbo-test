import express, { Request, Response } from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import { Paper, Subject, User, Club, UserClub } from '../models';

dotenv.config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY as string;

if (!SECRET_KEY) throw new Error('SECRET_KEY is not defined');

interface JwtPayload {
  id: number;
}

function getUserIdFromRequest(req: Request): number | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY) as unknown as JwtPayload;
    return decoded.id;
  } catch {
    return null;
  }
}

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

interface UploadBody {
  subjectId: number;
  description?: string;
  clubId?: number;
}

router.post(
  '/upload',
  upload.single('file'),
  async (req: Request<{}, {}, UploadBody>, res: Response): Promise<void>  => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      res.status(401).json({ message: '인증 필요' });
      return;
    }

    const { subjectId, description, clubId } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: '사용자 없음' });
        return;
      }

      const subject = await Subject.findByPk(subjectId);
      if (!subject) {
        res.status(404).json({ message: '과목 없음' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
      }

      if (clubId) {
        const isMember = await UserClub.findOne({ where: { userId, clubId } });
        if (!isMember) {
          res.status(403).json({ message: '동아리 소속이 아닙니다.' });
          return;
        }
      }

      const paper = await Paper.create({
        filename: req.file?.filename ?? '',
        description,
        userId,
        subjectId,
        clubId: clubId || null,
      });

      res.json({ message: '업로드 완료', paper });
    } catch (err: any) {
      res.status(500).json({ message: '업로드 실패', error: err.message });
    }
  }
);

router.get('/subject/:subjectId', async (req: Request<{ subjectId: string }>, res: Response): Promise<void>  => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ message: '인증 필요' });
    return;
  }

  const subjectId = parseInt(req.params.subjectId, 10);

  try {
    const memberships = await UserClub.findAll({ where: { userId } });
    const myClubIds = memberships.map((m) => m.clubId);

    const papers = await Paper.findAll({
      where: {
        subjectId,
      },
      include: [User, Club],
      order: [['createdAt', 'DESC']],
    });

    const visible = papers.filter((paper) => {
      if (paper.clubId != null) {
        return myClubIds.includes(paper.clubId);
      }
      return paper.clubId === null;
    });

    res.json(visible);
  } catch (err: any) {
    res.status(500).json({ message: '데이터 조회 실패', error: err.message });
  }
});

export default router;
