"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
class Conditions {
    static createCondition(name) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`INSERT INTO health_condition (name) VALUES (?)`, [name], (err, data) => {
                if (err)
                    reject(err);
                resolve("success");
            });
        });
    }
    static getAllConditions() {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM health_condition`, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
}
exports.default = Conditions;
