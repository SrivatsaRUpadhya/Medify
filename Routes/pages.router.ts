const router = require("express").Router();
import { Request, Response } from "express";
import { auth } from "../Controllers/auth.controller";

router.get("/register", (req:Request, res:Response)=>res.render("register.pug"));
router.get("/login", (req:Request, res:Response)=>res.render("login.pug"))
router.get("/dashboard", auth, (req:Request, res:Response)=>res.render("dashboard.pug", {user: res.locals.user}))

export default router;
