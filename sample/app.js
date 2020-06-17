import PushKit from "../client";
const pubKey = "BK83EbzbKBq5ok1lFeLLeNIDLIqK8rLpVfXxvkyxzavwtMxZs20VNdqnvC7GZgUFpDYd9hGFX297FNL62KqtfeA"
const pvKey  = "3fo8fS5kw2mZnXHZ5ZuGHzPh8_eyClligVOHsL3FhwI";
let _pkit    = new PushKit(pubKey, true);
window._pkit = _pkit;
navigator.serviceWorker.register("./sw.js")
	.then(reg=>{
		_pkit.handleRegistration(reg).then(reg=>{
			console.log(reg);
		});
	})
	.catch(e=>console.log(e));