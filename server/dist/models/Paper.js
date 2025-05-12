"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
const User_1 = __importDefault(require("./User"));
const Subject_1 = __importDefault(require("./Subject"));
const Paper = index_1.default.define('Paper', {
    filename: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
});
User_1.default.hasMany(Paper);
Paper.belongsTo(User_1.default);
Subject_1.default.hasMany(Paper);
Paper.belongsTo(Subject_1.default);
module.exports = Paper;
