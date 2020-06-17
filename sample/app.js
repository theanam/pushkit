import PushKit from "../client";
const pubKey = "BPfPpLZa6UqsaJBy-k61DXufimrk_YF90v-wzxGw77Q16YIMg3i62VowmgxIIP58-QlBZHzJBxYHq-3El7h7Hps"
const pvKey  = "_x3M4yesDRDmNeDB-eemxZFCigOJVHnhG1OKxoJ7uCc";
let _pkit    = new PushKit(pubKey, true);
window._pkit = _pkit;
navigator.serviceWorker.register("./sw.js")
	.then(_pkit.handleRegistration)
	.catch(e=>console.log(e));