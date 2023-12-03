import { Router } from "express";
import { updateProfile } from "../Controllers/user.controller";
import { auth } from "../Controllers/auth.controller";
const router = Router();

router.post("/api/user/updateProfile", auth, updateProfile);
export default router;
