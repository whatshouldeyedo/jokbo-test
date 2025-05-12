"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Paper = require('../models/Paper');
const SubjectModel = require('../models/Subject');
const User = require('../models/User');
const router = express_1.default.Router();
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const basename = path_1.default.basename(file.originalname, ext);
        cb(null, `${basename}-${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post('/upload', upload.single('file'), async (req, res) => {
    const { subjectId, description } = req.body;
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({ message: '로그인이 필요합니다' });
        return;
    }
    try {
        const token = auth.split(' ')[1];
        if (!SECRET_KEY) {
            throw new Error('SECRET_KEY is not defined in the environment variables');
        }
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        if (typeof decoded !== 'object' || !('id' in decoded)) {
            res.status(403).json({ message: '유효하지 않은 토큰' });
            return;
        }
        const user = await User.findByPk(decoded.id);
        const subject = await SubjectModel.findByPk(subjectId);
        if (!subject) {
            res.status(404).json({ message: '과목 없음' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
            return;
        }
        const paper = await Paper.create({
            filename: req.file.filename,
            description,
            UserId: user.id,
            SubjectId: subject.id,
        });
        res.json({ message: '업로드 완료', paper });
        return;
    }
    catch (err) {
        res.status(403).json({ message: '유효하지 않은 요청', error: err.message });
        return;
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
    }
    catch (err) {
        res.status(500).json({ message: '데이터를 불러오는 중 오류 발생' });
    }
});
module.exports = router;
