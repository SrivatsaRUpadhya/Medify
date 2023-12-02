create table if not exists health_condition(
	id bigint auto_increment unique key,
    condition_id varchar(50) primary key default(uuid()),
    condition_name varchar(100)
);

create table if not exists user(
	id bigint auto_increment unique key,
    patient_id varchar(100) not null primary key default(uuid()),
    patient_name VARCHAR(50) not null,
	phone varchar(10) not null,
	alt_phone varchar(10) not null,
	age int,
	gender enum('Female', 'Male', 'Other'),
	height int,
	weight int
);

create table if not exists account(
	id bigint auto_increment unique key,
	account_id varchar(50) primary key default(uuid()),
	email varchar(50) not null,
	password varchar(100) not null
);

create table if not exists userOnAccount(
	id bigint auto_increment unique key,
	account_id varchar(50),
	patient_id varchar(50),

	foreign key(account_id) references account(account_id) on delete cascade on update cascade,

	foreign key(patient_id) references user(patient_id) on delete cascade on update cascade
);

create table if not exists doctor(
	id bigint auto_increment unique key,
    doctor_id varchar(50) primary key default(uuid()),
    doctor_name varchar(100),
    phone varchar(10),
    expertise varchar(100)
);
 
create table if not exists hospital(
	id bigint auto_increment unique key,
    hospital_id varchar(50) primary key default(uuid()),
    hospital_name varchar(100) not null,
    hospital_location varchar(100)
);


create table if not exists medicine(
	id bigint auto_increment unique key,
    medicine_id varchar(50) primary key default(uuid()),
    medicine_name varchar(50),
    medicine_desc varchar(150)
);

create table doctorOnHospital(
	id bigint auto_increment unique key,
	hospital_id varchar(50),
	doctor_id varchar(50),

	foreign key(hospital_id) references hospital( hospital_id) on delete cascade on update cascade,
	foreign key(doctor_id) references doctor(doctor_id) on delete cascade on update cascade
);

create table med_for_health_condidion(
	id bigint auto_increment unique key,
	condition_id varchar(50),
	medicine_id varchar(50),
	doctor_id varchar(50),


    foreign key (doctor_id) references doctor(doctor_id) on delete cascade on update cascade,

    foreign key (condition_id) references health_condition(condition_id) on delete cascade on update cascade,

    foreign key (medicine_id) references medicine(medicine_id) on delete cascade on update cascade

);

create table conditionOnUser(
	id bigint auto_increment unique key,
	condition_id varchar(50),
	patient_id varchar(50),

	foreign key(condition_id) references health_condition(condition_id) on delete cascade on update cascade,
	foreign key(patient_id) references user(patient_id) on delete cascade on update cascade
);

