import { NextFunction, Request, Response } from "express";
import Account from "../Models/account.model";
import asyncWraper from "../utils/asyncWrapper";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import secrets from "../utils/secrets";
import User from "../Models/user.model";
import { AccessTokenType, Medications, UsersInAccount } from "../Models/types";

const profileDetails = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const patient_id = String(req.query.patient_id);
		const user = await User.getUserProfile(patient_id);
		console.log(user.medications[0]);
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
			patient_id,
		} = req.body;
		const result = await User.UpdateUser({
			name,
			phone,
			alt_phone,
			age,
			gender,
			height,
			weight,
			patient_id,
		});
		console.log(result);
		res.status(200).send("success");
	});
};

const dashboardContent = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const users = await Account.getUsersInAccount(res.locals.user.userId);
		const medicationsInAccount = await Account.getMedicationsInAccount(
			res.locals.user.userId
		);
		const medicines = await Account.getMedicinesInAccount(
			res.locals.user.userId
		);
		const conditions = await Account.getConditionsInAccount(
			res.locals.user.userId
		);

		let usersList: { info: UsersInAccount; medications: Medications[] }[] =
			[];

		users.forEach((user) => {
			const userMedications = medicationsInAccount.filter(
				(medication) => medication.patient_id === user.patient_id
			);
			const finalMedications = userMedications.map((element) => {
				const medicine = medicines.find(
					(medicine) => medicine.id === element.medicine_id
				);
				const condition = conditions.find(
					(condition) => condition.id === element.condition_id
				);
				return {
					condition: condition,
					medicine: medicine,
					schedule: element.schedule || "",
					dosage: element.dosage || "",
				};
			});
			usersList.push({ info: user, medications: finalMedications });
		});
		console.log(usersList);
		res.render("dashboard.pug", { usersList: usersList });
	});
};

export { profileDetails, updateProfile, dashboardContent };
