import { OkPacket } from "mysql2";
import db from "../utils/db";
import hash from "../utils/hash";
import { AccountType } from "./types";
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
						console.log( 
							(data as OkPacket).insertId
								  )
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
	//static async deleteUserById(id: string) {
	//	return await db.execute(`DELETE FROM account where account_id=?`, [id]);
	//}
}

export default Account;
