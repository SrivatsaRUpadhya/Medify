const secrets = {
    host: process.env.HOST,
    port: process.env.PORT,
	serverPort:process.env.SERVER_PORT,
	serverUrl:process.env.SERVER_URL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    jwt_key: process.env.JWT_KEY,
    jwt_expire: process.env.JWT_EXPIRE,
    db_url: process.env.DATABASE_URL,
	clientURL_1: process.env.CLIENT_URL_1,
	clientURL_2: process.env.CLIENT_URL_2,
};

export default secrets
