"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
if (!fs_1.default.existsSync('uploads'))
    fs_1.default.mkdirSync('uploads');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const basename = path_1.default.basename(file.originalname, ext);
        cb(null, `${basename}-${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'File not uploaded' });
        return;
    }
    res.json({
        savedAs: req.file.filename,
        original: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
    });
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use('/auth', require('./routes/auth'));
app.use('/subjects', require('./routes/subject'));
app.use('/papers', require('./routes/paper'));
const models_1 = __importDefault(require("./models"));
models_1.default.sync({ alter: true }).then(() => {
    console.log('DB 동기화 완료');
    app.listen(PORT, () => {
        console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
    });
});
