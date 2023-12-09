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
const db_1 = __importDefault(require("../utils/db"));
class Subscriptions {
    static getAllSubscriptions() {
        return new Promise((resolve, reject) => {
            db_1.default.query('SELECT * FROM subscriptions', (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
    }
    static getSubscriptionsByAccountId(account_id) {
        return new Promise((resolve, reject) => {
            db_1.default.query('SELECT * FROM subscriptions WHERE account_id = ?', [account_id], (err, res) => {
                if (err)
                    reject(err);
                resolve(res);
            });
        });
    }
    static addSubscription(account_id, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(subscription);
            const existingSubscription = yield Subscriptions.getSubscriptionsByAccountId(account_id);
            if (!existingSubscription)
                yield db_1.default.promise().query('INSERT INTO subscriptions (account_id, subscription) VALUES (?,?)', [account_id, JSON.stringify(subscription)]);
            else
                yield db_1.default.promise().query('UPDATE subscriptions SET subscription = ? WHERE account_id = ?', [JSON.stringify(subscription), account_id]);
        });
    }
}
exports.default = Subscriptions;
