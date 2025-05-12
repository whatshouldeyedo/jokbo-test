const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const SECRET_KEY = 'mysecretkey';

// 회원가입
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: '이미 존재하는 이메일입니다' });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, name });
    res.json({ message: '회원가입 완료' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: '사용자를 찾을 수 없습니다' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: '비밀번호 불일치' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, {
      expiresIn: '2h',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

// 내 정보 확인
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: '인증 필요' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });

    res.json({ email: user.email, name: user.name });
  } catch (err) {
    res.status(403).json({ message: '유효하지 않은 토큰' });
  }
});

module.exports = router;
