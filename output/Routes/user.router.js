"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../Controllers/user.controller");
const auth_controller_1 = require("../Controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/api/user/updateProfile", auth_controller_1.auth, user_controller_1.updateProfile);
router.post("/api/user/addPatient", auth_controller_1.auth, user_controller_1.addPatient);
exports.default = router;
