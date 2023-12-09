import { Request, Response } from "express";
import Medicines from "../Models/medicines.model";
import asyncWraper from "../utils/asyncWrapper";
import Conditions from "../Models/conditions.model";


const addPatientForm = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		res.status(200).render("includes/addPatientForm.pug");
	});
}

const addMedForm = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const medicines = await Medicines.getAllMedicines();
		const conditions = await Conditions.getAllConditions();
		res.render("includes/addMedForm.pug", {
			medicines,
			conditions,
			patient_id: req.body.patient_id,
		});
	});
};
const addMedication = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const { patient_id, medicine_id, condition_id, schedule, dosage } =
			req.body;
		await Medicines.setMedicineForCondition(
			patient_id,
			condition_id,
			medicine_id,
			schedule,
			dosage
		);
		res.status(200).render("includes/button.pug", {patient_id: patient_id});
	});
};

const removeMedication = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const { patient_id, medicine_id, condition_id } = req.body;
		await Medicines.removeMedicineForCondition(
			patient_id,
			medicine_id,
			condition_id
		);
		res.status(200).send("Removed");
	});
};

export { addMedForm, removeMedication, addMedication , addPatientForm};
