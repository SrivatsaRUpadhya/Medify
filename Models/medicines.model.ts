import db from "../utils/db";
import { MedicineType } from "./types";

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
		medicine_id: number
	) {
		return new Promise<"success">((resolve, reject) => {
			db.query(
				`INSERT INTO medForCondition (patient_id, condition_id, medicine_id) VALUES (?,?,?)`,
				[patient_id, condition_id, medicine_id],
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
}
