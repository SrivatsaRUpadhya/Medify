import { OkPacket } from "mysql2";
import db from "../utils/db";
import hash from "../utils/hash";
import {
	AccountType,
	ConditionType,
	Medications,
	MedicineForCondition,
	MedicineType,
	UserType,
	UsersInAccount,
} from "./types";
class Account {
	private password: string;
	private email: string;

	constructor(email: string, password: string) {
		this.password = password;
		this.email = email;
	}

	static getAccountByInsertId(insertId: number) {
		console.log(insertId);
		return new Promise<AccountType>((resolve, reject) => {
			db.query<AccountType[]>(
				`SELECT * FROM account WHERE id= ?`,
				[insertId],
				(err, data) => {
					if (err) reject(err);
					resolve(data[0]);
				}
			);
		});
	}

	static getAccountByEmail(email: string) {
		return new Promise<AccountType | undefined>((resolve, reject) => {
			db.query<AccountType[]>(
				`SELECT * FROM account WHERE email = ?`,
				[email],
				(err, data) => {
					if (err) reject(err);
					resolve(data[0]);
				}
			);
		});
	}

	async create() {
		const existingUser = await Account.getAccountByEmail(this.email);
		const hashedPassword = await hash(this.password);
		if (!existingUser) {
			return new Promise<string>((resolve, reject) => {
				db.query(
					`INSERT INTO account (email, password)
				 VALUES 
				 (?,?)
				`,
					[this.email, hashedPassword],
					async (err, data) => {
						if (err) reject(err);
						console.log((data as OkPacket).insertId);
						const newAccount = await Account.getAccountByInsertId(
							(data as OkPacket).insertId
						);
						console.log(newAccount);
						resolve(newAccount.account_id);
					}
				);
			});
		}
		throw new Error("User already exists");
	}

	static getUsersInAccount(accountId: string) {
		return new Promise<UsersInAccount[]>((resolve, reject) => {
			db.query<UsersInAccount[]>(
				`SELECT U.patient_id,U.patient_name, U.age, U.gender FROM userOnAccount A, user U WHERE A.account_id = ? AND A.patient_id = U.patient_id`,
				[accountId],
				(err, data) => {
					if (err) reject(err);
					resolve(data);
				}
			);
		});
	}

	static getMedicationsInAccount(accountId: string) {
		return new Promise<MedicineForCondition[]>((resolve, reject) => {
			db.query<MedicineForCondition[]>(
				`SELECT * FROM medForCondition WHERE patient_id in (SELECT patient_id FROM account WHERE account_id = ?)`,
				[accountId],
				(err, data) => {
					if (err) reject(err);
					return resolve(data);
				}
			);
		});
	}
	static getMedicinesInAccount(accountId: string) {
		return new Promise<MedicineType[]>((resolve, reject) => {
			db.query<MedicineType[]>(
				`SELECT * FROM medicine WHERE id in (SELECT medicine_id FROM medForCondition WHERE patient_id in (SELECT patient_id FROM userOnAccount WHERE account_id = ? ))`,
				[accountId],
				(err, data) => {
					if (err) reject(err);
					return resolve(data);
				}
			);
		});
	}
	static getConditionsInAccount(accountId: string) {
		return new Promise<ConditionType[]>((resolve, reject) => {
			db.query<ConditionType[]>(
				`SELECT * FROM health_condition WHERE id in (SELECT condition_id FROM medForCondition WHERE patient_id in (SELECT patient_id FROM userOnAccount WHERE account_id = ?))`,
				[accountId],
				(err, data) => {
					if (err) reject(err);
					return resolve(data);
				}
			);
		});
	}
	//static async deleteUserById(id: string) {
	//	return await db.execute(`DELETE FROM account where account_id=?`, [id]);
	//}
}

export default Account;
