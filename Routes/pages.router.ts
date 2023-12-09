const router = require("express").Router();
import { Request, Response } from "express";
import { auth } from "../Controllers/auth.controller";
import { profileDetails, dashboardContent} from "../Controllers/user.controller";
import { addMedForm, addMedication, addPatientForm, removeMedication } from "../Controllers/page.controller";

router.get("/register", (req:Request, res:Response)=>res.render("register.pug"));
router.get("/login", (req:Request, res:Response)=>res.render("login.pug"))
router.get("/dashboard", auth, dashboardContent)
router.get("/profile", auth, profileDetails)
router.post("/api/action/addMedForm", auth, addMedForm)
router.get("/addPatient", auth, addPatientForm)
router.post("/api/action/removeMedication", auth, removeMedication)
router.post("/api/action/addMedication", auth, addMedication)


export default router;
