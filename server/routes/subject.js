const express = require('express');
const Subject = require('../models/Subject');
const router = express.Router();

// 과목 전체 조회
router.get('/', async (req, res) => {
  const list = await Subject.findAll();
  res.json(list);
});

// 과목 추가 (테스트용)
router.post('/', async (req, res) => {
  const { name } = req.body;
  const subject = await Subject.create({ name });
  res.json(subject);
});

module.exports = router;
