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

interface AccessTokenType {
	email: string;
	userId: string;
}

interface MedicineType extends RowDataPacket {
	id: bigint;
	medicine_name: string;
}
interface ConditionType extends RowDataPacket {
	id: bigint;
	condition_name: string;
}

interface MedicineForCondition extends RowDataPacket {
	id: bigint;
	patient_id: string;
	condition_id: bigint;
	medicine_id: bigint;
	schedule?: string;
	dosage?: string;
}

interface Medications {
	condition: string;
	medicine: string;
	schedule?: string;
	dosage?: string;
}

interface ProfileType {
	info: UserType;
	medications: Medications[];
}

interface UsersInAccount extends RowDataPacket {
	patient_id: string;
	patient_name: string;
	age: number;
	gender: "Male" | "Female" | "Other";
}

export {
	UserType,
	AccountType,
	AccessTokenType,
	MedicineType,
	ConditionType,
	Medications,
	MedicineForCondition,
	ProfileType,
	UsersInAccount,
};
