import express from 'express';
import Subject from '../models/Subject';
const router = express.Router();

router.get('/', async (req, res) => {
  const list = await Subject.findAll();
  res.json(list);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const subject = await Subject.create({ name });
  res.json(subject);
});

export default router;
