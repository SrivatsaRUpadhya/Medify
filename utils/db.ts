import * as mysql from "mysql2";
import secrets from "./secrets";

let db;
if (secrets.db_url) {
	db = mysql.createPool(secrets.db_url);
	db.query("SELECT 1", (err, rows) => {
		if (err) {
			console.error("Failed to connect to database");
			process.exit(1);
		}
		console.log("Connected to database");
	});
} else {
	db = mysql.createPool({
		host: secrets.host,
		user: secrets.user,
		database: secrets.database,
		password: secrets.password,
		port: parseInt(secrets.port || "3306"),
	});
}

export default db;
