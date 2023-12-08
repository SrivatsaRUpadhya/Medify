import db from "../utils/db";
import { Medications, MedicineForCondition, MedicineType } from "./types";

class Medicines {
	static createMedicine(name: string, desc: string) {
		return new Promise<string>((resolve, reject) => {
			db.query(
				`INSERT INTO medicine (name, description) VALUES (?,?)`,
				[name, desc],
				(err, data) => {
					if (err) reject(err);
					resolve("success");
				}
			);
		});
	}

	static setMedicineForCondition(
		patient_id: string,
		condition_id: number,
		medicine_id: number,
		schedule: string,
		dosage: string
	) {
		return new Promise<"success">((resolve, reject) => {
			db.query(
				`INSERT INTO medForCondition (patient_id, condition_id, medicine_id, schedule, dosage) VALUES (?,?,?)`,
				[patient_id, condition_id, medicine_id, schedule, dosage],
				(err) => {
					if (err) reject(err);
					resolve("success");
				}
			);
		});
	}

	static getAllMedicines() {
		return new Promise<MedicineType[]>((resolve, reject) => {
			db.query<MedicineType[]>(`SELECT * FROM medicine`, (err, data) => {
				if (err) reject(err);
				resolve(data);
			});
		});
	}

	static removeMedicineForCondition(
		patient_id: string,
		condition_id: number,
		medicine_id: number
	) {
		return new Promise<"success">((resolve, reject) => {
			db.query(
				`DELETE FROM medForCondition WHERE patient_id=? AND condition_id=? AND medicine_id=?`,
				[patient_id, condition_id, medicine_id],
				(err) => {
					if (err) reject(err);
					resolve("success");
				}
			);
		});
	}

	static getAllMedications() {
		return new Promise<MedicineForCondition[]>((resolve, reject) => {
			db.query<MedicineForCondition[]>(
				`SELECT * FROM medForCondition`,
				(err, data) => {
					if (err) reject(err);
					resolve(data);
				}
			);
		});
	}
}

export default Medicines;
