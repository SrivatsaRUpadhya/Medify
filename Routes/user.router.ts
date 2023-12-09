import { Router } from "express";
import { addPatient, updateProfile } from "../Controllers/user.controller";
import { auth } from "../Controllers/auth.controller";
const router = Router();

router.post("/api/user/updateProfile", auth, updateProfile);
router.post("/api/user/addPatient", auth, addPatient);
export default router;
