function getSubStatus(reg){
	reg.pushManager.getSubscription()
		.then(sub=>{
			console.log(sub);
		})
		.catch(handlePushError);
}
function handlePushRegistration(reg){
	if(!reg || !reg.pushManager) throw new Error(`Please call this function as a callback
	 of the service worker 
	 registration. or call it with the service worker registration object`);
	return getSubStatus(reg);
}

function handlePushError(err){
	console.log("Error initiating push notification. The following error occured:");
	console.error(err);
}
function init(sw,publicKey){
	if(!sw) throw new Error("Must supply a service worker");
	if (!('serviceWorker' in navigator) || !('PushManager' in window)){
		return console.log("Service worker or push manager not supported");
	}
	navigator.serviceWorker.register(sw).then(handlePushRegistration).catch(handlePushError);
}

export {handlePushRegistration,handlePushError,init as default}