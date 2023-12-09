"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const web_push_1 = __importDefault(require("web-push"));
router.get("/api/notifications/vapidPublicKey", function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
});
router.post("/api/notifications/register", function (req, res) {
    // A real world application would store the subscription info.
    console.log(req.body);
    res.sendStatus(201);
});
router.post("/api/notifications/sendNotification", function (req, res) {
    const subscription = req.body.subscription;
    const payload = null;
    const options = {
        TTL: req.body.ttl,
    };
    setTimeout(function () {
        web_push_1.default
            .sendNotification(subscription, payload, options)
            .then(function () {
            res.sendStatus(201);
        })
            .catch(function (error) {
            res.sendStatus(500);
            console.log(error);
        });
    }, req.body.delay * 1000);
});
