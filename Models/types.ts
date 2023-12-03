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

interface MedicineType extends RowDataPacket {
	id:bigint;
	name:string;
}
interface ConditionType extends RowDataPacket {
	id:bigint;
	name:string;
}

interface MedicineForCondition extends RowDataPacket{
	id:bigint;
	patient_id:string;
	condition_id:bigint;
	medicine_id:bigint;
}

interface Medications {
	condition: string;
	medicine: string;
}

interface ProfileType{
	info:UserType;
	medications:Medications[];
}

export {UserType, AccountType, AccessTokenType, MedicineType, ConditionType, Medications, MedicineForCondition, ProfileType};
