import { Request, Response } from "express";
import Medicines from "../Models/medicines.model";
import asyncWraper from "../utils/asyncWrapper";
import Conditions from "../Models/conditions.model";

const addMedForm = (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const medicines = await Medicines.getAllMedicines();
		const conditions= await Conditions.getAllConditions();
		res.render("addMedForm.pug", { medicines, conditions});
	});
}
const addMedication= (req: Request, res: Response) => {
	asyncWraper(req, res, async (req: Request, res: Response) => {
		const { patient_id, medicine_id, condition_id, schedule, dosage } =
			req.body;
		await Medicines.setMedicineForCondition(
			patient_id,
			medicine_id,
			condition_id,
			schedule,
			dosage
		);
		res.status(200).send("success");
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
		res.status(200).send("success");
	});
}

export { addMedForm , removeMedication};
