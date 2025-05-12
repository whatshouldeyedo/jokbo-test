"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Subject = require('../models/Subject');
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const list = await Subject.findAll();
    res.json(list);
});
router.post('/', async (req, res) => {
    const { name } = req.body;
    const subject = await Subject.create({ name });
    res.json(subject);
});
module.exports = router;
