/// <reference types="./index" />
const _log = (msg) => console.log(msg);
function toUint8Array(base64String) {
	const padding     = '='.repeat((4 - base64String.length % 4) % 4);
	const base64      = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData     = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
	  outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
function getSubStatus(reg){
	return new Promise((resolve,reject)=>{
		reg.pushManager.getSubscription()
			.then(sub=>{
				if(sub === null) return reject(null);
				else return resolve(sub);
			})
			.catch(reject);	
	})
}
function requestPushSubscription(reg,key){ 
	return new Promise((resolve,reject)=>{
		let applicationServerKey = toUint8Array(key);
		reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey
		}).then(resolve).catch(reject);
	})
}
/**
 * @type {import('./index')}
 */
export default function PushKit(publicKey, verbose = false){
	if(!publicKey || typeof publicKey !== "string") throw new Error("Public key must be a valid VAPT key");
	this.supported  = true;
	this.subscribed = false;
	this.key        = publicKey;
	this.reg        = null;
	this.sub        = null;
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) this.supported = false;	
	this.handleRegistration = (reg) =>{
		if(!reg) throw new Error("Service worker registration object required as argument");
		return new Promise(resolve=>{
			if(this.supported === false) return resolve(null);
			this.reg = reg;
			getSubStatus(this.reg).then(sub=>{
				this.sub        = sub;
				this.subscribed = true;
				if(verbose) _log("Already Push Subscribed");
				return resolve(this.sub);
			}).catch(e=>{
				if(verbose) _log(e);
				requestPushSubscription(this.reg,this.key).then(sub=>{
					this.sub        = sub;
					this.subscribed = true;
					if(verbose) _log("Freshly Push Subscribed");
					return resolve(this.sub);
				}).catch(e=>{
					if(verbose) _log(e);
					return resolve(null);
				})
			})
		})
	}
}