"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.me = exports.logout = exports.login = exports.register = void 0;
const account_model_1 = __importDefault(require("../Models/account.model"));
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = __importDefault(require("../utils/secrets"));
const user_model_1 = __importDefault(require("../Models/user.model"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, asyncWrapper_1.default)(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const body = yield req.body;
            const { name, email, password, phone, alt_phone, gender, age, height, weight, } = body;
            if (!name ||
                !phone ||
                !password ||
                !email ||
                !alt_phone ||
                !req.body["g-recaptcha-response"]) {
                return res.status(200).json({
                    status: "error",
                    data: "invalid credentials",
                });
            }
            const captcha_response = yield req.body["g-recaptcha-response"];
            const account = new account_model_1.default(email, password);
            const user = new user_model_1.default(name, phone, alt_phone, gender, age, height, weight);
            const acc_id = yield account.create();
            let userId;
            if (acc_id) {
                userId = (yield user.CreateUser(acc_id)).patient_id;
            }
            else {
                throw new Error("Account not created");
            }
            const verify_captcha = yield axios_1.default.post("https://www.google.com/recaptcha/api/siteverify", {
                secret: process.env.SECRET_KEY,
                response: captcha_response,
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            if (!verify_captcha.data.success)
                throw new Error("Captcha failed");
            const token = jsonwebtoken_1.default.sign({ name, email, userId }, String(secrets_1.default.jwt_key), {
                expiresIn: secrets_1.default.jwt_expire,
            });
            res.cookie("accessToken", token, {
                expires: new Date(Date.now() + 3600000 * 24),
                httpOnly: true,
            });
            res.setHeader("HX-Redirect", "/dashboard");
            return res.status(200).send("success");
        }
        catch (error) {
            console.log(error);
            return res.status(200).json({ message: "Error" });
        }
    }));
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, asyncWrapper_1.default)(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = yield req.body;
        console.log(req.body);
        const captcha_response = yield req.body["g-recaptcha-response"];
        if (!email || !password) {
            return res.status(201).send("Invalid credentials");
        }
        const final_user = yield account_model_1.default.getAccountByEmail(email);
        if (!final_user) {
            return res.status(501).send("User not found");
        }
        //console.log(final_user);
        const isPassword = yield bcrypt_1.default.compare(password.toString(), final_user.password.toString());
        if (!isPassword) {
            return res.status(501).send("Invalid credentials");
        }
        const sessionData = {
            email: final_user.email,
            userId: final_user.account_id,
        };
        const verify_captcha = yield axios_1.default.post("https://www.google.com/recaptcha/api/siteverify", {
            secret: process.env.SECRET_KEY,
            response: captcha_response,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        console.log(verify_captcha.data);
        //if (!verify_captcha.data.success) throw new Error("Captcha failed");
        const token = jsonwebtoken_1.default.sign(sessionData, secrets_1.default.jwt_key, {
            expiresIn: "1h",
        });
        res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 3600000 * 24),
            httpOnly: true,
        });
        console.log(sessionData);
        res.setHeader("HX-Redirect", "/dashboard");
        return res.status(200).send("success");
    }));
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, asyncWrapper_1.default)(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.clearCookie("accessToken", {
                expires: new Date(Date.now() + 3600000 * 24),
                httpOnly: true,
            });
            res.setHeader("HX-Redirect", "/login");
            return res.status(200).send("success");
        }
        catch (error) {
            console.log(error);
            return res.status(200).json({ message: "Error" });
        }
    }));
});
exports.logout = logout;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, asyncWrapper_1.default)(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        const cookies = req.cookies;
        const token = cookies.accessToken;
        console.log(cookies);
        if (token) {
            const tokenData = jsonwebtoken_1.default.decode(token);
            const result = yield account_model_1.default.getAccountByEmail(tokenData === null || tokenData === void 0 ? void 0 : tokenData.email);
            return res.status(200).json({
                message: "success",
                user: result,
            });
        }
        else {
            return res.status(200).json({ message: "Not logged in" });
        }
    }));
});
exports.me = me;
const auth = (req, res, next) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.cookies);
        const { accessToken } = req.cookies;
        if (!accessToken) {
            res.setHeader("HX-Redirect", "/login");
            return res.status(200).redirect("/login");
        }
        try {
            jsonwebtoken_1.default.verify(accessToken, secrets_1.default.jwt_key);
            const user = jsonwebtoken_1.default.decode(accessToken);
            res.locals.user = user;
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.setHeader("HX-Redirect", "/login");
                return res.status(200).redirect("/login");
            }
            else {
                throw err;
            }
        }
    }));
};
exports.auth = auth;
