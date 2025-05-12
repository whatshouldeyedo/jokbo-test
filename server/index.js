const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    savedAs: req.file.filename,
    original: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/auth', require('./routes/auth'));
app.use('/subjects', require('./routes/subject'));
app.use('/papers', require('./routes/paper'));

const sequelize = require('./models');
sequelize.sync({ alter: true }).then(() => {
  console.log('DB 동기화 완료');
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
  });
});