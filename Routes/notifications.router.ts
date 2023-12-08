const router = require("express").Router();
import webPush from "web-push";
import { Request, Response } from "express";
import { auth } from "../Controllers/auth.controller";
import Subscriptions from "../Models/subscription.model";

webPush.setVapidDetails(
	"https://example.com/",
	String(process.env.VAPID_PUBLIC_KEY),
	String(process.env.VAPID_PRIVATE_KEY)
);

router.get(
	"/api/notifications/vapidPublicKey",
	function (req: Request, res: Response) {
		console.log("vapidPublicKey");
		res.send(process.env.VAPID_PUBLIC_KEY);
	}
);

router.post(
	"/api/notifications/register",auth,
	async function (req: Request, res: Response) {
		// A real world application would store the subscription info.
		const { subscription } = req.body;
		await Subscriptions.addSubscription(res.locals.user.userId, subscription);
		res.sendStatus(201);
	}
);

router.post(
	"/api/notifications/sendNotification",
	function (req: Request, res: Response) {
		console.log("sendNotification");
		console.log(req.body);
		const subscription = req.body.subscription;
		const payload = null;
		const options = {
			TTL: req.body.ttl,
		};

		setTimeout(function () {
			webPush
				.sendNotification(subscription, payload, options)
				.then(function () {
					res.sendStatus(201);
				})
				.catch(function (error) {
					res.sendStatus(500);
					console.log(error);
				});
		}, req.body.delay * 1000);
	}
);

export default router;
