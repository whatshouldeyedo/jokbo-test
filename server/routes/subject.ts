import express, { Request, Response } from 'express';
import { Subject } from '../models';

const router = express.Router();
import asyncHandler from 'express-async-handler';

router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const list = await Subject.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ message: '과목 목록 조회 실패', error: err.message });
  }
}));

interface SubjectBody {
  name: string;
}

router.post('/', asyncHandler(async (req: Request<{}, {}, SubjectBody>, res: Response): Promise<void> => {
  const { name } = req.body;

  try {
    const subject = await Subject.create({ name });
    res.json(subject);
  } catch (err: any) {
    res.status(500).json({ message: '과목 생성 실패', error: err.message });
  }
}));

export default router;
