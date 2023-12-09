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
exports.addPatient = exports.dashboardContent = exports.updateProfile = exports.profileDetails = void 0;
const account_model_1 = __importDefault(require("../Models/account.model"));
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const user_model_1 = __importDefault(require("../Models/user.model"));
const profileDetails = (req, res) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const patient_id = String(req.query.patient_id);
        const user = yield user_model_1.default.getUserProfile(patient_id);
        console.log(user.medications[0]);
        res.render("profile.pug", { user });
    }));
};
exports.profileDetails = profileDetails;
const updateProfile = (req, res) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, phone, alt_phone, age, gender, height, weight, patient_id, } = req.body;
        const result = yield user_model_1.default.UpdateUser({
            name,
            phone,
            alt_phone,
            age,
            gender,
            height,
            weight,
            patient_id,
        });
        console.log(result);
        res.status(200).send("success");
    }));
};
exports.updateProfile = updateProfile;
const addPatient = (req, res) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, phone, alt_phone, age, gender, height, weight } = req.body;
        const user = new user_model_1.default(name, phone, alt_phone, gender, age, height, weight);
        yield user.CreateUser(res.locals.user.userId);
        res.setHeader("HX-Redirect", "/dashboard");
        return res.status(200).send("success");
    }));
};
exports.addPatient = addPatient;
const dashboardContent = (req, res) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield account_model_1.default.getUsersInAccount(res.locals.user.userId);
        const medicationsInAccount = yield account_model_1.default.getMedicationsInAccount(res.locals.user.userId);
        const medicines = yield account_model_1.default.getMedicinesInAccount(res.locals.user.userId);
        const conditions = yield account_model_1.default.getConditionsInAccount(res.locals.user.userId);
        let usersList = [];
        users.forEach((user) => {
            const userMedications = medicationsInAccount.filter((medication) => medication.patient_id === user.patient_id);
            const finalMedications = userMedications.map((element) => {
                const medicine = medicines.find((medicine) => medicine.id === element.medicine_id);
                const condition = conditions.find((condition) => condition.id === element.condition_id);
                return {
                    condition: condition,
                    medicine: medicine,
                    schedule: element.schedule || "",
                    dosage: element.dosage || "",
                };
            });
            usersList.push({ info: user, medications: finalMedications });
        });
        console.log(usersList);
        res.render("dashboard.pug", { usersList: usersList });
    }));
};
exports.dashboardContent = dashboardContent;
