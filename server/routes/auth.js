const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const USERS_FILE = './users.json';
const SECRET_KEY = 'mysecretkey'; // 나중엔 .env로 빼기

// 유저 목록 불러오기
const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
};

// 회원가입
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: '이미 가입된 이메일입니다' });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed, name });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ message: '회원가입 완료' });
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: '존재하지 않는 계정' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: '비밀번호 오류' });

  const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, {
    expiresIn: '2h',
  });
  res.json({ token });
});

// 내 정보 확인 (토큰 기반)
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: '인증 필요' });

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json(decoded);
  } catch (err) {
    res.status(403).json({ message: '유효하지 않은 토큰' });
  }
});

module.exports = router;
