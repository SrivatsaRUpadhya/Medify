import Account from "../Models/account.model";
import Medicines from "../Models/medicines.model";
import Subscriptions from "../Models/subscription.model";
import webPush from "web-push";

const today = new Date();
let morning = false;
let noon = false;
let evening = false;

const notify = async () => {
	console.log("Running notify");
	const allAccounts = await Account.getUsersOnAccount();
	const allSubscriptions = await Subscriptions.getAllSubscriptions();
	const allMedications = await Medicines.getAllMedications();

	// Get all the people who have a medication
	const morning_people = allMedications.filter(
		(medication) => medication.schedule?.split("-")[0] === "1"
	);
	const noon_people = allMedications.filter(
		(medication) => medication.schedule?.split("-")[1] === "1"
	);
	const evening_people = allMedications.filter(
		(medication) => medication.schedule?.split("-")[2] === "1"
	);

	// Get all the account ids of the people who have a medication
	const morning_account_ids = allAccounts.filter((account) =>
		morning_people.find(
			(medication) => medication.patient_id === account.patient_id
		)
			? true
			: false
	);
	const noon_account_ids = allAccounts.filter((account) =>
		noon_people.find(
			(medication) => medication.patient_id === account.patient_id
		)
			? true
			: false
	);
	const evening_account_ids = allAccounts.filter((account) =>
		evening_people.find(
			(medication) => medication.patient_id === account.patient_id
		)
			? true
			: false
	);

	// Get the unique account ids
	const unique_morning_account_ids = morning_account_ids.filter(
		(value, index, array) => array.indexOf(value) === index
	);
	const unique_noon_account_ids = noon_account_ids.filter(
		(value, index, array) => array.indexOf(value) === index
	);
	const unique_evening_account_ids = evening_account_ids.filter(
		(value, index, array) => array.indexOf(value) === index
	);

	// Get the subscriptions of the unique account ids
	const morning_subscriptions = unique_morning_account_ids.map((account) =>
		allSubscriptions.find(
			(subscription) => subscription.account_id === account.account_id
		)
	);
	const noon_subscriptions = unique_noon_account_ids.map((account) =>
		allSubscriptions.find(
			(subscription) => subscription.account_id === account.account_id
		)
	);
	const evening_subscriptions = unique_evening_account_ids.map((account) =>
		allSubscriptions.find(
			(subscription) => subscription.account_id === account.account_id
		)
	);

	// Send the notifications
	if (today.getHours() === 15 && !morning) {
		console.log(morning_subscriptions);
		morning_subscriptions.map((sub) => {
			console.log("Sending morning notifications to: " + sub?.account_id);
			const subscription = sub?.subscription;
			const payload = "";
			const options = {
				TTL: 0,
			};
			if (subscription)
				webPush
					.sendNotification(subscription, payload, options)
					.then(function () {
						morning = true;
					})
					.catch(function (error) {
						console.log(error);
					});
		});
	}
	if (today.getHours() === 15 && !noon) {
		noon_subscriptions.map((sub) => {
			const subscription = sub?.subscription;

			const payload = "";
			const options = {
				TTL: 0,
			};
			if (subscription)
				webPush
					.sendNotification(subscription, payload, options)
					.then(function () {
						noon = true;
					})
					.catch(function (error) {
						console.log(error);
					});
		});
	}
	if (today.getHours() === 20 && !evening) {
		evening_subscriptions.map((sub) => {
			const subscription = sub?.subscription;

			const payload = "";
			const options = {
				TTL: 0,
			};
			if (subscription)
				webPush
					.sendNotification(subscription, payload, options)
					.then(function () {
						evening = true;
					})
					.catch(function (error) {
						console.log(error);
					});
		});
	}
};

export default notify;
