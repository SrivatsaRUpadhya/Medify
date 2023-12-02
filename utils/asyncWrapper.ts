import { Response, Request } from "express";
const asyncWraper = async (
	req: Request,
	res: Response,
	func: Function
) => {
	try {
		return func(req, res);
	} catch (error) {
		console.log(error);
		return res.json({ message: "An error occurred!" });
	}
};
export default asyncWraper;
