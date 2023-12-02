import * as mysql from 'mysql2'
import secrets from "./secrets"
 const db = mysql.createPool({
	host:secrets.host,
	user:secrets.user,
	database:secrets.database,
	password:secrets.password,
})

export default db
