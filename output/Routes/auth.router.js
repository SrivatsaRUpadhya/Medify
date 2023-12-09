"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const auth_controller_1 = require("../Controllers/auth.controller");
router.post("/api/auth/register", auth_controller_1.register);
router.post("/api/auth/login", auth_controller_1.login);
router.get("/api/auth/me", auth_controller_1.auth, auth_controller_1.me);
router.delete("/api/auth/logout", auth_controller_1.logout);
exports.default = router;
