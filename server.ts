import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import authRouter from "./Routes/auth.router";
import pageRouter from "./Routes/pages.router";
import userRouter from "./Routes/user.router";
import secrets from "./utils/secrets";
import { z } from "zod";

try {
	const app = express();
	var whitelist = [
		z.string().parse(secrets.clientURL_1),
		z.string().parse(secrets.clientURL_2),
		"http://localhost:3000",
	];

	//Do not delete the following commented lines, keep this to know what headers are to be set

	//app.use((req, res, next) => {
	//    res.set('Access-Control-Allow-Origin', clientURL);
	//    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	//    res.set('Access-Control-Allow-Headers', 'Content-Type');
	//    res.set('Access-Control-Allow-Credentials', true);
	//    next();
	//})

	var corsOptions: CorsOptions = {
		origin: function (origin, callback) {
			if (whitelist.indexOf(z.string().parse(origin)) !== -1) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		methods: ["GET", "DELETE", "POST"],
		allowedHeaders: ["Content-Type"],
		exposedHeaders: ["set-cookie"],
	};
	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.get("/", (req: Request, res: Response) => res.render("index.pug"));

	app.engine('pug', require('pug').__express)
	app.use(express.static("public"));
	app.use(pageRouter);
	app.use(userRouter);
	app.options("*", cors(corsOptions));
	app.use(cors(corsOptions));
	app.use(authRouter);
	app.listen(secrets.serverPort, () => {
		console.log(`Server live on port: ${secrets.serverPort}`);
	});
	const formatMemoryUsage = (data: any) =>
		`${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

	const memoryData = process.memoryUsage();

	const memoryUsage = {
		rss: `${formatMemoryUsage(
			memoryData.rss
		)} -> Resident Set Size - total memory allocated for the process execution`,
		heapTotal: `${formatMemoryUsage(
			memoryData.heapTotal
		)} -> total size of the allocated heap`,
		heapUsed: `${formatMemoryUsage(
			memoryData.heapUsed
		)} -> actual memory used during the execution`,
		external: `${formatMemoryUsage(
			memoryData.external
		)} -> V8 external memory`,
	};

	console.log(memoryUsage);
} catch (error) {
	console.log(error);
}

