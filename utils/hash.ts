import * as bcrypt from "bcrypt";
const hash = async (password: string) => {
	try {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default hash;
