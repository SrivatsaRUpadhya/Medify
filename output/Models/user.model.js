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
class User {
    constructor(name, phone, alt_phone, gender, age, height, weight) {
        this.name = name;
        this.phone = phone;
        this.alt_phone = alt_phone;
        this.gender = gender;
        this.age = age;
        this.height = height;
        this.weight = weight;
    }
    static getUsersByEmail(email) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM account JOIN user WHERE email = ?`, [email], (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static getUserByPatientId(patient_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM user WHERE patient_id = ?`, [patient_id], (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static getUserByInsertId(insertId) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM user WHERE id= ?`, [insertId], (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static addUserToAccount(account_id, patient_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`INSERT INTO userOnAccount (account_id , patient_id) VALUES (?,?)`, [account_id, patient_id], (err) => {
                if (err)
                    return reject(err);
                return resolve("success");
            });
        });
    }
    CreateUser(account_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`INSERT INTO user (patient_name, phone, alt_phone, age, gender, height, weight) VALUES (?,?,?,?,?,?,?)`, [
                this.name,
                this.phone,
                this.alt_phone,
                this.age,
                this.gender,
                this.height,
                this.weight,
            ], (err, results, fields) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return reject(err);
                const newUser = yield User.getUserByInsertId(results.insertId);
                yield User.addUserToAccount(account_id, newUser.patient_id);
                return resolve(newUser);
            }));
        });
    }
    static UpdateUser({ name, phone, alt_phone, age, gender, height, weight, patient_id, }) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`UPDATE user SET patient_name = ?,phone = ?, alt_phone = ?, age = ?, gender = ?, height = ?, weight = ? WHERE patient_id = ?`, [
                name,
                phone,
                alt_phone,
                age,
                gender,
                height,
                weight,
                patient_id,
            ], (err) => {
                if (err)
                    reject(err);
                resolve("success");
            });
        });
    }
    static getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db_1.default.query(`SELECT * FROM user`, (err, data) => {
                    if (err)
                        reject(err);
                    resolve(data);
                });
            });
        });
    }
    static setUsetHealthCondition(patient_id, condition_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`UPDATE conditionOnUser SET condition_id = ? WHERE patient_id = ?`, [condition_id, patient_id], (err) => {
                if (err)
                    reject(err);
                resolve("success");
            });
        });
    }
    //Method to return all the medicines for a particular user
    static getUserMedicines(patient_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT M.id, M.medicine_name FROM medicine M, medForCondition MFC WHERE patient_id = ? and MFC.medicine_id = M.id`, [patient_id], (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    //Method to return all the conditions for a particular user
    static getUserConditions(patient_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT H.id, H.condition_name FROM health_condition H, medForCondition MFC WHERE patient_id = ? and MFC.condition_id = H.id`, [patient_id], (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getUserMedications(patient_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT medicine_id, condition_id FROM medForCondition WHERE patient_id = ?`, [patient_id], (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    reject(err);
                const medicines = yield User.getUserMedicines(patient_id);
                const conditions = yield User.getUserConditions(patient_id);
                let medications = [];
                data.map((med) => {
                    let medicine = medicines.find((m) => m.id == med.medicine_id);
                    let condition = conditions.find((c) => c.id == med.condition_id);
                    if (medicine && condition) {
                        medications.push({
                            condition: condition,
                            medicine: medicine,
                        });
                    }
                });
                resolve(medications);
            }));
        });
    }
    static getUserProfile(patient_id) {
        return new Promise((resolve, reject) => {
            User.getUserByPatientId(patient_id)
                .then((info) => __awaiter(this, void 0, void 0, function* () {
                const medications = yield User.getUserMedications(info.patient_id);
                resolve({ info: info, medications });
            }))
                .catch((err) => {
                reject(err);
            });
        });
    }
}
exports.default = User;
