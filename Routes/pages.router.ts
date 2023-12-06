const router = require("express").Router();
import { Request, Response } from "express";
import { auth } from "../Controllers/auth.controller";
import { profileDetails, dashboardContent} from "../Controllers/user.controller";

router.get("/register", (req:Request, res:Response)=>res.render("register.pug"));
router.get("/login", (req:Request, res:Response)=>res.render("login.pug"))
router.get("/dashboard", auth, dashboardContent)
router.get("/profile", auth, profileDetails)


export default router;
