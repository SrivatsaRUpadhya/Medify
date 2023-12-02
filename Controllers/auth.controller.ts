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
				altPhone,
				gender,
				age,
				height,
				weight,
			} = body;
			if (!name || !phone || !password || !email || !altPhone) {
				return res.status(200).json({
					status: "error",
					data: "invalid credentials",
				});
			}
			const account = new Account(email, password);
			const user = new User(
				name,
				phone,
				altPhone,
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

			const token = jwt.sign(
				{ name, email, userId },
				String(secrets.jwt_key),
				{
					expiresIn: secrets.jwt_expire,
				}
			);

			res.cookie("accessToken", token, {
				expires: new Date(Date.now() + 3600000 * 24),
				domain: secrets.serverUrl,
				path: "/api",
				httpOnly: true,
				sameSite: "none",
				secure: true,
			});
			return res.status(200).json({
				message: "success",
				user: { name, phone, email },
			});
		} catch (error) {
			console.log(error);
			return res.status(200).json({ message: "Error" });
		}
	});
};

const login = async (req: Request, res: Response) => {
	await asyncWraper(req, res, async () => {
		try {
			const { email, password, captcha_response } = await req.body;
			if (!email || !password || !captcha_response) {
				return res.status(200).json({
					status: "error",
					data: "invalid credentials",
				});
			}
			const final_user = await User.getUserByEmail(email);
			if (!final_user) {
				return res.status(200).json({
					status: "error",
					data: "user not found",
				});
			}

			console.log(final_user);
			const isPassword = await bcrypt.compare(
				password.toString(),
				final_user.password.toString()
			);
			if (!isPassword) {
				return res.status(200).json({
					status: "error",
					data: "incorrect password or contact number",
				});
			}
			const sessionData = {
				name: final_user.patient_name,
				email: final_user.email,
				userId: final_user.patient_id,
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
			if (!verify_captcha.data.success) throw new Error("Captcha failed");
			const token = jwt.sign(sessionData as JwtPayload, "secret key", {
				expiresIn: "1h",
			});

			res.cookie("accessToken", token, {
				expires: new Date(Date.now() + 3600000 * 24),
				path: "/api",
				httpOnly: true,
			});
			console.log(sessionData);
			return res.status(200).json(sessionData);
		} catch (error) {
			console.log(error);
			res.status(200).json({ message: "Error" });
		}
	});
};

const logout = async (req: Request, res: Response) => {
	await asyncWraper(req, res, async () => {
		try {
			res.clearCookie("accessToken");
			return res.status(200).json({ message: "success" });
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
			const result = await User.getUserByEmail(tokenData?.email);
			return res.status(200).json({
				message: "success",
				user: result[0],
			});
		} else {
			return res.status(200).json({ message: "Not logged in" });
		}
	});
};

const auth = (req: Request, res: Response, next: NextFunction) => {
	const {accessToken} = req.cookies;
	console.log(req.cookies);
	if (!accessToken) {
		return res.status(401).json({ status: "error", data: "invalid user" });
	}
	try {
		jwt.verify(accessToken, secrets.jwt_key as string);
		const user = jwt.decode(
			accessToken
		) as JwtPayload as AccessTokenType;
		res.locals.user = user;
		next();
	} catch (err) {
		return res
			.status(401)
			.json({ status: "error", data: "invalid user", error: err });
	}
};

export { register, login, logout, me, auth };
