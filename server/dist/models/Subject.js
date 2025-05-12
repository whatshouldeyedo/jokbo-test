"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const Subject = index_1.default.define('Subject', {
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.default = Subject;
