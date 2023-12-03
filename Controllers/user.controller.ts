import { NextFunction, Request, Response } from "express";
import Account from "../Models/account.model";
import asyncWraper from "../utils/asyncWrapper";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import secrets from "../utils/secrets";
import User from "../Models/user.model";
import { AccessTokenType } from "../Models/types";

const profileDetails = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const user = await User.getUserProfile(res.locals.user.email);
		console.log(user);
		res.render("profile.pug", { user });
	});
};

const updateProfile = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const {
			name,
			phone,
			alt_phone,
			age,
			gender,
			height,
			weight,
		} = req.body;
		const result = await User.UpdateUser({name, phone, alt_phone, age, gender, height, weight, patient_id:res.locals.user.userId});
		console.log(result)
		res.status(200).send("success");
	});
};

export { profileDetails, updateProfile};
