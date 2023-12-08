const router = require("express").Router();
import { Request, Response } from "express";
import { auth } from "../Controllers/auth.controller";
import { profileDetails, dashboardContent} from "../Controllers/user.controller";
import { addMedForm, removeMedication } from "../Controllers/page.controller";

router.get("/register", (req:Request, res:Response)=>res.render("register.pug"));
router.get("/login", (req:Request, res:Response)=>res.render("login.pug"))
router.get("/dashboard", auth, dashboardContent)
router.get("/profile", auth, profileDetails)
router.get("/api/action/addMedForm", auth, addMedForm)
router.post("/api/action/removeMedication", auth, removeMedication)


export default router;
