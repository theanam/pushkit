import toUint8Array from 'urlb64touint8array';

let ref = {
	supported: false,
	subscribed: false,
	key: null,
	reg: null,
	auto: true
}

function checkSW(){
	if(!ref.reg) throw new Error("Service worker registration not complete"); 
}
function requestPushSubscription(){ 
	return new Promise((resolve,reject)=>{
		checkSW();
		let applicationServerKey = toUint8Array(ref.key);
		ref.reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey
		}).then(sub=>{
			resolve(sub);
		}).catch(reject);
	})
}
function getSubStatus(){
	return new Promise((resolve,reject)=>{
		checkSW();
		ref.reg.pushManager.getSubscription()
			.then(sub=>{
				if(sub === null){
					console.log("User not subscribed");
					if(!ref.auto) return reject(false);
					return requestPushSubscription();
				}
				else{
					ref.supported = true;
					console.log("User subscribed");
					return resolve(sub);
				}
			})
			.catch(reject);	
	})
	
}
function handlePushRegistration(reg){
	if(!reg || !reg.pushManager) throw new Error(`Please call this function as a callback
	 of the service worker 
	 registration. or call it with the service worker registration object`);
	ref.reg = reg;
	return getSubStatus();
}

function handlePushError(err){
	console.log("Error initiating push notification. The following error occured:");
	console.error(err);
}
function init(sw,publicKey,auto = true){
	if(!sw) throw new Error("Must supply a service worker");
	if(!publicKey || typeof publicKey !== "string") throw new Error("Public key must be a valid VAPT key");
	if (!('serviceWorker' in navigator) || !('PushManager' in window)){
		return console.log("Service worker or push manager not supported");
	}
	ref.supported = true;
	ref.key       = publicKey;
	ref.auto      = auto;
	return navigator.serviceWorker.register(sw).then(handlePushRegistration).catch(handlePushError);
}

export {
	handlePushRegistration,
	handlePushError,
	requestPushSubscription,
	getSubStatus,
	init as default}


