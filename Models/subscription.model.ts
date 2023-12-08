import db from "../utils/db";
import { SubscriptionType } from "./types";

class Subscriptions{
	static getAllSubscriptions(){
		return new Promise<SubscriptionType[]>((resolve, reject) => {
			db.query<SubscriptionType[]>('SELECT * FROM subscriptions', (err, res) => {
				if(err) reject(err);
				resolve(res);
			});
		});
	}

	static getSubscriptionsByAccountId(account_id: string){
		return new Promise<SubscriptionType[]>((resolve, reject) => {
			db.query<SubscriptionType[]>('SELECT * FROM subscriptions WHERE account_id = ?', [account_id], (err, res) => {
				if(err) reject(err);
				resolve(res);
			});
		});
	}

	static async addSubscription(account_id: string, subscription: string){
		console.log(subscription)
		const existingSubscription = await Subscriptions.getSubscriptionsByAccountId(account_id);
		if(!existingSubscription)
			await db.promise().query('INSERT INTO subscriptions (account_id, subscription) VALUES (?,?)', [account_id, JSON.stringify(subscription)])
		else
			await db.promise().query('UPDATE subscriptions SET subscription = ? WHERE account_id = ?', [JSON.stringify(subscription), account_id]);
	}
}

export default Subscriptions;
