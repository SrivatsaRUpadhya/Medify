"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const hash_1 = __importDefault(require("../utils/hash"));
class Account {
    constructor(email, password) {
        this.password = password;
        this.email = email;
    }
    static getAccountByInsertId(insertId) {
        console.log(insertId);
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM account WHERE id= ?`, [insertId], (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static getAccountByEmail(email) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM account WHERE email = ?`, [email], (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield Account.getAccountByEmail(this.email);
            const hashedPassword = yield (0, hash_1.default)(this.password);
            if (!existingUser) {
                return new Promise((resolve, reject) => {
                    db_1.default.query(`INSERT INTO account (email, password)
				 VALUES 
				 (?,?)
				`, [this.email, hashedPassword], (err, data) => __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            reject(err);
                        console.log(data.insertId);
                        const newAccount = yield Account.getAccountByInsertId(data.insertId);
                        console.log(newAccount);
                        resolve(newAccount.account_id);
                    }));
                });
            }
            throw new Error("User already exists");
        });
    }
    static getUsersInAccount(accountId) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT U.patient_id,U.patient_name, U.age, U.gender FROM userOnAccount A, user U WHERE A.account_id = ? AND A.patient_id = U.patient_id`, [accountId], (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getMedicationsInAccount(accountId) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM medForCondition WHERE patient_id in (SELECT patient_id FROM account WHERE account_id = ?)`, [accountId], (err, data) => {
                if (err)
                    reject(err);
                return resolve(data);
            });
        });
    }
    static getMedicinesInAccount(accountId) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM medicine WHERE id in (SELECT medicine_id FROM medForCondition WHERE patient_id in (SELECT patient_id FROM userOnAccount WHERE account_id = ? ))`, [accountId], (err, data) => {
                if (err)
                    reject(err);
                return resolve(data);
            });
        });
    }
    static getConditionsInAccount(accountId) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM health_condition WHERE id in (SELECT condition_id FROM medForCondition WHERE patient_id in (SELECT patient_id FROM userOnAccount WHERE account_id = ?))`, [accountId], (err, data) => {
                if (err)
                    reject(err);
                return resolve(data);
            });
        });
    }
    //static async deleteUserById(id: string) {
    //	return await db.execute(`DELETE FROM account where account_id=?`, [id]);
    //}
    static getUsersOnAccount() {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM userOnAccount`, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getAllAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db_1.default.query(`SELECT * FROM account`, (err, data) => {
                    if (err)
                        reject(err);
                    resolve(data);
                });
            });
        });
    }
}
exports.default = Account;
