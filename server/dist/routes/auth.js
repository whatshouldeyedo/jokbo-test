"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const exists = await User_1.default.findOne({ where: { email } });
        if (exists) {
            res.status(400).json({ message: '이미 존재하는 이메일입니다' });
            return;
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        await User_1.default.create({ email, password: hashed, name });
        res.json({ message: '회원가입 완료' });
    }
    catch (err) {
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: '사용자를 찾을 수 없습니다' });
            return;
        }
        const passwordHash = user.get('password');
        const match = await bcryptjs_1.default.compare(password, passwordHash);
        if (!match) {
            res.status(401).json({ message: '비밀번호 불일치' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.get('id'),
            email: user.get('email'),
            name: user.get('name')
        }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
});
router.get('/me', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({ message: '인증 필요' });
        return;
    }
    try {
        const token = auth.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        const user = await User_1.default.findByPk(decoded.id);
        if (!user) {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
            return;
        }
        res.json({ email: user.get('email'), name: user.get('name') });
    }
    catch (err) {
        res.status(403).json({ message: '유효하지 않은 토큰' });
    }
});
exports.default = router;
