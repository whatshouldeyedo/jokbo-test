const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 업로드 디렉토리 없으면 생성
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// multer 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .pdf
    const basename = path.basename(file.originalname, ext); // jbtest
    cb(null, `${basename}-${Date.now()}${ext}`); // jbtest-168332434.pdf
  },
});

const upload = multer({ storage });

// 업로드 API
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    savedAs: req.file.filename,
    original: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
  });
});

// 파일 접근 가능하게 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});

// 이 위에 있는 기존 코드들 유지한 채로 추가:
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
