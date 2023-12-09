import db from "../utils/db";
import { ConditionType } from "./types";

class Conditions {
	static createCondition(name: string) {
		return new Promise<string>((resolve, reject) => {
			db.query(
				`INSERT INTO health_condition (name) VALUES (?)`,
				[name],
				(err, data) => {
					if (err) reject(err);
					resolve("success");
				}
			);
		});
	}

	static getAllConditions() {
		return new Promise<ConditionType[]>((resolve, reject) => {
			db.query<ConditionType[]>(
				`SELECT * FROM health_condition`,
				(err, data) => {
					if (err) reject(err);
					resolve(data);
				}
			);
		});
	}
}

export default Conditions;
