const router = require("express").Router();
import {
	register,
	me,
	logout,
	auth,
	login,
} from "../Controllers/auth.controller";

router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.get("/api/auth/me", auth, me);
router.delete("/api/auth/logout", logout);

export default router;
