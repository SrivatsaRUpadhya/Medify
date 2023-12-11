import { NextFunction, Request, Response } from "express";
import Account from "../Models/account.model";
import asyncWraper from "../utils/asyncWrapper";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import secrets from "../utils/secrets";
import User from "../Models/user.model";
import { AccessTokenType } from "../Models/types";

const register = async (req: Request, res: Response) => {
	await asyncWraper(req, res, async () => {
		try {
			const body = await req.body;
			const {
				name,
				email,
				password,
				phone,
				alt_phone,
				gender,
				age,
				height,
				weight,
			} = body;
			if (
				!name ||
				!phone ||
				!password ||
				!email ||
				!alt_phone ||
				!req.body["g-recaptcha-response"]
			) {
				return res.status(200).json({
					status: "error",
					data: "invalid credentials",
				});
			}
			const captcha_response = await req.body["g-recaptcha-response"];
			const account = new Account(email, password);
			const user = new User(
				name,
				phone,
				alt_phone,
				gender,
				age,
				height,
				weight
			);
			const acc_id = await account.create();
			let userId: string;
			if (acc_id) {
				userId = (await user.CreateUser(acc_id)).patient_id;
			} else {
				throw new Error("Account not created");
			}
			const verify_captcha = await axios.post(
				"https://www.google.com/recaptcha/api/siteverify",
				{
					secret: process.env.SECRET_KEY,
					response: captcha_response,
				},
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			);
			if (!verify_captcha.data.success) throw new Error("Captcha failed");
			const token = jwt.sign(
				{ name, email, userId },
				String(secrets.jwt_key),
				{
					expiresIn: secrets.jwt_expire,
				}
			);

			res.cookie("accessToken", token, {
				expires: new Date(Date.now() + 3600000 * 24),
				httpOnly: true,
			});
			res.setHeader("HX-Redirect", "/dashboard");
			return res.status(200).send("success");
		} catch (error) {
			console.log(error);
			return res.status(200).json({ message: "Error" });
		}
	});
};

const login = async (req: Request, res: Response) => {
	await asyncWraper(req, res, async () => {
		const { email, password } = await req.body;
		console.log(req.body);
		const captcha_response = await req.body["g-recaptcha-response"];
		if (!email || !password ) {
			return res.status(201).send("Invalid credentials");
		}
		const final_user = await Account.getAccountByEmail(email);
		if (!final_user) {
			return res.status(501).send("User not found");
		}

		//console.log(final_user);
		const isPassword = await bcrypt.compare(
			password.toString(),
			final_user.password.toString()
		);
		if (!isPassword) {
			return res.status(501).send("Invalid credentials");
		}
		const sessionData = {
			email: final_user.email,
			userId: final_user.account_id,
		};
		const verify_captcha = await axios.post(
			"https://www.google.com/recaptcha/api/siteverify",
			{
				secret: process.env.SECRET_KEY,
				response: captcha_response,
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		console.log(verify_captcha.data);
		//if (!verify_captcha.data.success) throw new Error("Captcha failed");
		const token = jwt.sign(
			sessionData as JwtPayload,
			secrets.jwt_key as string,
			{
				expiresIn: "1h",
			}
		);

		res.cookie("accessToken", token, {
			expires: new Date(Date.now() + 3600000 * 24),
			httpOnly: true,
		});
		console.log(sessionData);
		res.setHeader("HX-Redirect", "/dashboard");
		return res.status(200).send("success");
	});
};

const logout = async (req: Request, res: Response) => {
	await asyncWraper(req, res, async () => {
		try {
			res.clearCookie("accessToken", {
				expires: new Date(Date.now() + 3600000 * 24),
				httpOnly: true,
			});
			res.setHeader("HX-Redirect", "/login");
			return res.status(200).send("success");
		} catch (error) {
			console.log(error);
			return res.status(200).json({ message: "Error" });
		}
	});
};

const me = async (req: Request, res: Response) => {
	await asyncWraper(req, res, async () => {
		const cookies = req.cookies;
		const token = cookies.accessToken;
		console.log(cookies);
		if (token) {
			const tokenData = jwt.decode(
				token
			) as JwtPayload as AccessTokenType;
			const result = await Account.getAccountByEmail(tokenData?.email);
			return res.status(200).json({
				message: "success",
				user: result,
			});
		} else {
			return res.status(200).json({ message: "Not logged in" });
		}
	});
};

const auth = (req: Request, res: Response, next: NextFunction) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		console.log(req.cookies);
		const { accessToken } = req.cookies;
		if (!accessToken) {
			res.setHeader("HX-Redirect", "/login");
			return res.status(200).redirect("/login");
		}
		try {
			jwt.verify(accessToken, secrets.jwt_key as string);
			const user = jwt.decode(
				accessToken
			) as JwtPayload as AccessTokenType;
			res.locals.user = user;
			next();
		} catch (err) {
			if (err instanceof jwt.TokenExpiredError) {
				res.setHeader("HX-Redirect", "/login");
				return res.status(200).redirect("/login");
			} else {
				throw err;
			}
		}
	});
};

export { register, login, logout, me, auth };
