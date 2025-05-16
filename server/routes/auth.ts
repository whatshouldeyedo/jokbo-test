import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}

interface SignupBody {
  email: string;
  password: string;
  name: string;
}

router.post('/signup', async (req: Request<{}, {}, SignupBody>, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      res.status(400).json({ message: '이미 존재하는 이메일입니다' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, name });
    res.json({ message: '회원가입 완료' });
  } catch (err: any) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

interface LoginBody {
  email: string;
  password: string;
}

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: '사용자를 찾을 수 없습니다' });
      return;
    }

    const passwordHash = user.password;
    const match = await bcrypt.compare(password, passwordHash);
    if (!match) {
      res.status(401).json({ message: '비밀번호 불일치' });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

interface JwtPayload {
  id: number;
  email: string;
  name: string;
}

router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ message: '인증 필요' });
    return;
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
      return;
    }

    res.json({ email: user.email, name: user.name });
  } catch (err) {
    res.status(403).json({ message: '유효하지 않은 토큰' });
  }
});

export default router;
