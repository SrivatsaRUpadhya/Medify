import { RowDataPacket } from "mysql2";

interface UserType extends RowDataPacket {
	id: number;
	patient_id: string;
	patient_name: string;
	phone: string;
	alt_phone: string;
	gender: "Male" | "Female" | "Other";
	age: number;
	height: number;
	weight: number;
}

interface AccountType extends RowDataPacket {
	id: number;
	account_id: string;
	email: string;
	password: string;
}

interface AccessTokenType{
	name:string;
	email:string;
	userId:string;
}

export {UserType, AccountType, AccessTokenType};
