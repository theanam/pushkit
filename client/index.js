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
function PushKit(publicKey, verbose = false){
	if(!publicKey || typeof publicKey !== "string") throw new Error("Public key must be a valid VAPT key");
	this.supported  = true;
	this.subscribed = false;
	this.key        = publicKey;
	this.reg        = null;
	this.sub        = null;
	this.granted    = false;
	if(window.Notification && "permission" in window.Notification) this.granted = (window.Notification.permission === "granted");
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) this.supported = false;	
	this._initRegistrationInternal = (swRegistration) =>{
		if(!swRegistration) throw new Error("Service worker registration object required as argument");
		return new Promise(resolve=>{
			if(this.supported === false) return resolve(null);
			this.reg = swRegistration;
			getSubStatus(this.reg).then(sub=>{
				this.sub        = sub;
				this.subscribed = true;
				this.granted    = true;
				if(verbose) _log("Already Push Subscribed");
				return resolve(this.sub);
			}).catch(e=>{
				if(verbose) _log(e);
				requestPushSubscription(this.reg,this.key).then(sub=>{
					this.sub        = sub;
					this.subscribed = true;
					this.granted    = true;
					if(verbose) _log("Freshly Push Subscribed");
					return resolve(this.sub);
				}).catch(e=>{
					if(verbose) _log(e);
					return resolve(null);
				})
			})
		})
	}
	this.handleRegistration = (swRegistration, verbose = false)=>{
		return new Promise(resolve=>{
			if(window.Notification && "requestPermission" in window.Notification){
				verbose && console.info("Using window.Notification API");
				if(window.Notification.permission === "granted") return this._initRegistrationInternal(swRegistration, verbose).then(resolve);
				window.Notification.requestPermission().then(permission=>{
					if(permission === "granted") return this._initRegistrationInternal(swRegistration, verbose).then(resolve);
					else{
						verbose && console.error("Notification permission denied");
						resolve(null);
					}
				})
				.catch(e=>{
					verbose && console.error("Failed to request notification permission", e);
					return reject(null);
				});
			}
			else{
				return this._initRegistrationInternal(swRegistration, verbose).then(resolve);
			}
		});
	}
}

export {PushKit}