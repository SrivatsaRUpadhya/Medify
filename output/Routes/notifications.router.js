"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const web_push_1 = __importDefault(require("web-push"));
const auth_controller_1 = require("../Controllers/auth.controller");
const subscription_model_1 = __importDefault(require("../Models/subscription.model"));
web_push_1.default.setVapidDetails("https://example.com/", String(process.env.VAPID_PUBLIC_KEY), String(process.env.VAPID_PRIVATE_KEY));
router.get("/api/notifications/vapidPublicKey", function (req, res) {
    console.log("vapidPublicKey");
    res.send(process.env.VAPID_PUBLIC_KEY);
});
router.post("/api/notifications/register", auth_controller_1.auth, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // A real world application would store the subscription info.
        const { subscription } = req.body;
        yield subscription_model_1.default.addSubscription(res.locals.user.userId, subscription);
        res.sendStatus(201);
    });
});
router.post("/api/notifications/sendNotification", function (req, res) {
    console.log("sendNotification");
    console.log(req.body);
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
exports.default = router;
