import { OkPacket } from "mysql2";
import db from "../utils/db";
import { UserType } from "./types";
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

	static getUserByEmail(email: string) {
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

	static async UpdateUser(
		patient_id: string,
		name: string | undefined,
		phone: string | undefined,
		alt_phone: string | undefined,
		gender: "Male" | "Female" | "Other" | undefined,
		age: number | undefined,
		height: number | undefined,
		weight: number | undefined
	) {
		return new Promise<"success">((resolve, reject) => {
			db.query(
				`UPDATE user SET patient_name = ?,phone = ?, gender = ?, alt_phone = ?, age = ?, height = ?, weight = ? WHERE patient_id = ?`,
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
}

export default User;
