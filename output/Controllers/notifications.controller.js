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
const account_model_1 = __importDefault(require("../Models/account.model"));
const medicines_model_1 = __importDefault(require("../Models/medicines.model"));
const subscription_model_1 = __importDefault(require("../Models/subscription.model"));
const web_push_1 = __importDefault(require("web-push"));
const today = new Date();
let morning = false;
let noon = false;
let evening = false;
const notify = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running notify");
    const allAccounts = yield account_model_1.default.getUsersOnAccount();
    const allSubscriptions = yield subscription_model_1.default.getAllSubscriptions();
    const allMedications = yield medicines_model_1.default.getAllMedications();
    // Get all the people who have a medication
    const morning_people = allMedications.filter((medication) => { var _a; return ((_a = medication.schedule) === null || _a === void 0 ? void 0 : _a.split("-")[0]) === "1"; });
    const noon_people = allMedications.filter((medication) => { var _a; return ((_a = medication.schedule) === null || _a === void 0 ? void 0 : _a.split("-")[1]) === "1"; });
    const evening_people = allMedications.filter((medication) => { var _a; return ((_a = medication.schedule) === null || _a === void 0 ? void 0 : _a.split("-")[2]) === "1"; });
    // Get all the account ids of the people who have a medication
    const morning_account_ids = allAccounts.filter((account) => morning_people.find((medication) => medication.patient_id === account.patient_id)
        ? true
        : false);
    const noon_account_ids = allAccounts.filter((account) => noon_people.find((medication) => medication.patient_id === account.patient_id)
        ? true
        : false);
    const evening_account_ids = allAccounts.filter((account) => evening_people.find((medication) => medication.patient_id === account.patient_id)
        ? true
        : false);
    // Get the unique account ids
    const unique_morning_account_ids = morning_account_ids.filter((value, index, array) => array.indexOf(value) === index);
    const unique_noon_account_ids = noon_account_ids.filter((value, index, array) => array.indexOf(value) === index);
    const unique_evening_account_ids = evening_account_ids.filter((value, index, array) => array.indexOf(value) === index);
    // Get the subscriptions of the unique account ids
    const morning_subscriptions = unique_morning_account_ids.map((account) => allSubscriptions.find((subscription) => subscription.account_id === account.account_id));
    const noon_subscriptions = unique_noon_account_ids.map((account) => allSubscriptions.find((subscription) => subscription.account_id === account.account_id));
    const evening_subscriptions = unique_evening_account_ids.map((account) => allSubscriptions.find((subscription) => subscription.account_id === account.account_id));
    // Send the notifications
    if (today.getHours() === 12 && !morning) {
        console.log(morning_subscriptions);
        morning_subscriptions.map((sub) => {
            console.log("Sending morning notifications to: " + (sub === null || sub === void 0 ? void 0 : sub.account_id));
            const subscription = sub === null || sub === void 0 ? void 0 : sub.subscription;
            const payload = "";
            const options = {
                TTL: 0,
            };
            if (subscription)
                web_push_1.default
                    .sendNotification(subscription, payload, options)
                    .then(function () {
                    morning = true;
                })
                    .catch(function (error) {
                    console.log(error);
                });
        });
    }
    if (today.getHours() === 12 && !noon) {
        noon_subscriptions.map((sub) => {
            const subscription = sub === null || sub === void 0 ? void 0 : sub.subscription;
            const payload = "";
            const options = {
                TTL: 0,
            };
            if (subscription)
                web_push_1.default
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
            const subscription = sub === null || sub === void 0 ? void 0 : sub.subscription;
            const payload = "";
            const options = {
                TTL: 0,
            };
            if (subscription)
                web_push_1.default
                    .sendNotification(subscription, payload, options)
                    .then(function () {
                    evening = true;
                })
                    .catch(function (error) {
                    console.log(error);
                });
        });
    }
});
exports.default = notify;
