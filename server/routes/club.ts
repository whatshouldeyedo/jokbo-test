import express, { Request, Response } from 'express';
import { User, Club, UserClub } from '../models';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
import asyncHandler from 'express-async-handler';
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) throw new Error('SECRET_KEY is not defined');

interface JwtPayload {
  id: number;
}

function getUserIdFromRequest(req: Request): number | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const token = auth.split(' ')[1];
    if (!SECRET_KEY) throw new Error('SECRET_KEY is not defined');
    const decoded = jwt.verify(token, SECRET_KEY as string) as unknown as JwtPayload;
    return decoded.id;
  } catch {
    return null;
  }
}

interface CreateClubBody {
  name: string;
}

router.post('/', asyncHandler(async (req: Request<{}, {}, CreateClubBody>, res: Response): Promise<void>  => {
  const userId = getUserIdFromRequest(req);
  if (!userId){
    res.status(401).json({ message: '인증 필요' });
    return;
  }

  const { name } = req.body;

  try {
    const existing = await Club.findOne({ where: { name } });
    if (existing) {
      res.status(400).json({ message: '이미 존재하는 동아리 이름입니다' });
      return;
    }

    const club = await Club.create({ name });
    await UserClub.create({ userId, clubId: club.id });

    res.status(201).json({ message: '동아리 생성 완료', club });
  } catch (err: any) {
    res.status(500).json({ message: '동아리 생성 실패', error: err.message });
  }
}));

interface InviteBody {
  email: string;
}

router.post('/:clubId/invite', asyncHandler(async (req: Request<{ clubId: string }, {}, InviteBody>, res: Response): Promise<void>  => {
  const userId = getUserIdFromRequest(req);
  if (!userId){
    res.status(401).json({ message: '인증 필요' });
    return;
  }

  const { clubId } = req.params;
  const { email } = req.body;

  try {
    const invitee = await User.findOne({ where: { email } });
    if (!invitee) {
      res.status(404).json({ message: '초대 대상 사용자를 찾을 수 없습니다' });
      return;
    }

    const exists = await UserClub.findOne({
      where: { userId: invitee.id, clubId: Number(clubId) },
    });
    if (exists) {
      res.status(400).json({ message: '이미 가입된 사용자입니다' });
      return;
    }

    await UserClub.create({ userId: invitee.id, clubId: Number(clubId) });
    res.json({ message: '초대 성공' });
  } catch (err: any) {
    res.status(500).json({ message: '초대 실패', error: err.message });
  }
}));

router.get('/mine', asyncHandler(async (req: Request, res: Response): Promise<void>  => {
  const userId = getUserIdFromRequest(req);
  if (!userId){
    res.status(401).json({ message: '인증 필요' });
    return;
  }

  try {
    const user = await User.findByPk(userId, {
      include: [Club],
    });

    if (!user){
        res.status(404).json({ message: '사용자 없음' });
        return;
    }

    res.json(user.Clubs);
  } catch (err: any) {
    res.status(500).json({ message: '동아리 목록 조회 실패', error: err.message });
  }
}));

export default router;
