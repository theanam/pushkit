import init from "../client";
const pubKey = "BPfPpLZa6UqsaJBy-k61DXufimrk_YF90v-wzxGw77Q16YIMg3i62VowmgxIIP58-QlBZHzJBxYHq-3El7h7Hps"
const pvKey  = "_x3M4yesDRDmNeDB-eemxZFCigOJVHnhG1OKxoJ7uCc";

init("./sw.js",pubKey)
	.then(dt=>console.log(JSON.stringify(dt)));