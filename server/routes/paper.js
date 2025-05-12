const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const Paper = require('../models/Paper');
const Subject = require('../models/Subject');
const User = require('../models/User');

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

router.post('/upload', upload.single('file'), async (req, res) => {
  const { subjectId, description } = req.body;
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ message: '로그인이 필요합니다' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id);

    const subject = await Subject.findByPk(subjectId);
    if (!subject) return res.status(404).json({ message: '과목 없음' });

    const paper = await Paper.create({
      filename: req.file.filename,
      description,
      UserId: user.id,
      SubjectId: subject.id,
    });

    res.json({ message: '업로드 완료', paper });
  } catch (err) {
    res.status(403).json({ message: '유효하지 않은 요청', error: err.message });
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


module.exports = router;
