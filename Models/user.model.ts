import { OkPacket } from "mysql2";
import db from "../utils/db";
import {
	ConditionType,
	Medications,
	MedicineForCondition,
	MedicineType,
	ProfileType,
	UserType,
} from "./types";
class User {
	private name: string;
	private age: number;
	private height: number;
	private weight: number;
	private gender: "Male" | "Female" | "Other";
	private phone: string;
	private alt_phone: string;

	constructor(
		name: string,
		phone: string,
		alt_phone: string,
		gender: "Male" | "Female" | "Other",
		age: number,
		height: number,
		weight: number
	) {
		this.name = name;
		this.phone = phone;
		this.alt_phone = alt_phone;
		this.gender = gender;
		this.age = age;
		this.height = height;
		this.weight = weight;
	}

	static getUsersByEmail(email: string) {
		return new Promise<UserType>((resolve, reject) => {
			db.query<UserType[]>(
				`SELECT * FROM account JOIN user WHERE email = ?`,
				[email],
				(err, data) => {
					if (err) reject(err);
					resolve(data[0]);
				}
			);
		});
	}

	static getUserByPatientId(patient_id: string) {
		return new Promise<UserType>((resolve, reject) => {
			db.query<UserType[]>(
				`SELECT * FROM user WHERE patient_id = ?`,
				[patient_id],
				(err, data) => {
					if (err) reject(err);
					resolve(data[0]);
				}
			);
		});
	}

	static getUserByInsertId(insertId: number) {
		return new Promise<UserType>((resolve, reject) => {
			db.query<UserType[]>(
				`SELECT * FROM user WHERE id= ?`,
				[insertId],
				(err, data) => {
					if (err) reject(err);
					resolve(data[0]);
				}
			);
		});
	}

	static addUserToAccount(account_id: string, patient_id: string) {
		return new Promise<"success">((resolve, reject) => {
			db.query(
				`INSERT INTO userOnAccount (account_id , patient_id) VALUES (?,?)`,
				[account_id, patient_id],
				(err) => {
					if (err) return reject(err);
					return resolve("success");
				}
			);
		});
	}

	CreateUser(account_id: string) {
		return new Promise<UserType>((resolve, reject) => {
			db.query(
				`INSERT INTO user (patient_name, phone, alt_phone, age, gender, height, weight) VALUES (?,?,?,?,?,?,?)`,
				[
					this.name,
					this.phone,
					this.alt_phone,
					this.age,
					this.gender,
					this.height,
					this.weight,
				],
				async (err, results, fields) => {
					if (err) return reject(err);
					const newUser = await User.getUserByInsertId(
						(results as OkPacket).insertId
					);
					await User.addUserToAccount(account_id, newUser.patient_id);
					return resolve(newUser);
				}
			);
		});
	}

	static UpdateUser({
		name,
		phone,
		alt_phone,
		age,
		gender,
		height,
		weight,
		patient_id,
	}: {
		name: string | undefined;
		phone: string | undefined;
		alt_phone: string | undefined;
		age: number | undefined;
		gender: "Male" | "Female" | "Other" | undefined;
		height: number | undefined;
		weight: number | undefined;
		patient_id: string;
	}) {
		return new Promise<"success">((resolve, reject) => {
			db.query(
				`UPDATE user SET patient_name = ?,phone = ?, alt_phone = ?, age = ?, gender = ?, height = ?, weight = ? WHERE patient_id = ?`,
				[
					name,
					phone,
					alt_phone,
					age,
					gender,
					height,
					weight,
					patient_id,
				],
				(err) => {
					if (err) reject(err);
					resolve("success");
				}
			);
		});
	}

	static async getUsers() {
		return new Promise<UserType[]>((resolve, reject) => {
			db.query<UserType[]>(`SELECT * FROM user`, (err, data) => {
				if (err) reject(err);
				resolve(data);
			});
		});
	}

	static setUsetHealthCondition(patient_id: string, condition_id: string) {
		return new Promise<"success">((resolve, reject) => {
			db.query(
				`UPDATE conditionOnUser SET condition_id = ? WHERE patient_id = ?`,
				[condition_id, patient_id],
				(err) => {
					if (err) reject(err);
					resolve("success");
				}
			);
		});
	}

	//Method to return all the medicines for a particular user
	static getUserMedicines(patient_id: string) {
		return new Promise<MedicineType[]>((resolve, reject) => {
			db.query<MedicineType[]>(
				`SELECT M.id, M.medicine_name FROM medicine M, medForCondition MFC WHERE patient_id = ? and MFC.medicine_id = M.id`,
				[patient_id],
				(err, data) => {
					if (err) reject(err);
					resolve(data);
				}
			);
		});
	}

	//Method to return all the conditions for a particular user
	static getUserConditions(patient_id: string) {
		return new Promise<ConditionType[]>((resolve, reject) => {
			db.query<ConditionType[]>(
				`SELECT H.id, H.condition_name FROM health_condition H, medForCondition MFC WHERE patient_id = ? and MFC.condition_id = H.id`,
				[patient_id],
				(err, data) => {
					if (err) reject(err);
					resolve(data);
				}
			);
		});
	}

	static getUserMedications(patient_id: string) {
		return new Promise<Medications[]>((resolve, reject) => {
			db.query<MedicineForCondition[]>(
				`SELECT medicine_id, condition_id FROM medForCondition WHERE patient_id = ?`,
				[patient_id],
				async (err, data) => {
					if (err) reject(err);
					const medicines = await User.getUserMedicines(patient_id);
					const conditions = await User.getUserConditions(patient_id);
					let medications: Medications[] = [];
					data.map((med) => {
						let medicine = medicines.find(
							(m) => m.id == med.medicine_id
						);
						let condition = conditions.find(
							(c) => c.id == med.condition_id
						);
						if (medicine && condition) {
							medications.push({
								condition: condition.name,
								medicine: medicine.name,
							});
						}
					});
					resolve(medications);
				}
			);
		});
	}

	static getUserProfile(patient_id: string) {
		return new Promise<ProfileType>((resolve, reject) => {
			User.getUserByPatientId(patient_id)
				.then(async (info) => {
					const medications = await User.getUserMedications(
						info.patient_id
					);
					resolve({ info: info, medications });
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}

export default User;
