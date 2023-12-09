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
exports.addPatientForm = exports.addMedication = exports.removeMedication = exports.addMedForm = void 0;
const medicines_model_1 = __importDefault(require("../Models/medicines.model"));
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const conditions_model_1 = __importDefault(require("../Models/conditions.model"));
const addPatientForm = (req, res) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).render("includes/addPatientForm.pug");
    }));
};
exports.addPatientForm = addPatientForm;
const addMedForm = (req, res) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const medicines = yield medicines_model_1.default.getAllMedicines();
        const conditions = yield conditions_model_1.default.getAllConditions();
        res.render("includes/addMedForm.pug", {
            medicines,
            conditions,
            patient_id: req.body.patient_id,
        });
    }));
};
exports.addMedForm = addMedForm;
const addMedication = (req, res) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { patient_id, medicine_id, condition_id, schedule, dosage } = req.body;
        yield medicines_model_1.default.setMedicineForCondition(patient_id, condition_id, medicine_id, schedule, dosage);
        res.status(200).render("includes/button.pug", { patient_id: patient_id });
    }));
};
exports.addMedication = addMedication;
const removeMedication = (req, res) => {
    (0, asyncWrapper_1.default)(req, res, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { patient_id, medicine_id, condition_id } = req.body;
        yield medicines_model_1.default.removeMedicineForCondition(patient_id, medicine_id, condition_id);
        res.status(200).send("Removed");
    }));
};
exports.removeMedication = removeMedication;
