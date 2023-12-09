"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
class Medicines {
    static createMedicine(name, desc) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`INSERT INTO medicine (name, description) VALUES (?,?)`, [name, desc], (err, data) => {
                if (err)
                    reject(err);
                resolve("success");
            });
        });
    }
    static setMedicineForCondition(patient_id, condition_id, medicine_id, schedule, dosage) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`INSERT INTO medForCondition (patient_id, condition_id, medicine_id, schedule, dosage) VALUES (?,?,?,?,?)`, [patient_id, condition_id, medicine_id, schedule, dosage], (err) => {
                if (err)
                    reject(err);
                resolve("success");
            });
        });
    }
    static getAllMedicines() {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM medicine`, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static removeMedicineForCondition(patient_id, condition_id, medicine_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query(`DELETE FROM medForCondition WHERE patient_id=? AND condition_id=? AND medicine_id=?`, [patient_id, condition_id, medicine_id], (err) => {
                if (err)
                    reject(err);
                resolve("success");
            });
        });
    }
    static getAllMedications() {
        return new Promise((resolve, reject) => {
            db_1.default.query(`SELECT * FROM medForCondition`, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
}
exports.default = Medicines;
