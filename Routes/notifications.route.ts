const router = require("express").Router();
import webPush from "web-push";
import { Request, Response } from "express";
import { auth } from "../Controllers/auth.controller";

  router.get("/api/notifications/vapidPublicKey", function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  });

  router.post("/api/notifications/register", function (req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });

  router.post("/api/notifications/sendNotification", function (req, res) {
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
  });
