importScripts("https://unpkg.com/pushkit@3.2.1/worker/binding.js"); 
// importScripts("binding.js"); 
var pushConfig = {
    icon  : "https://theanam.github.io/pushkit/pushkit.png",
    badge : "https://theanam.github.io/pushkit/pushkit.png"
}
attachPushKit(self, pushConfig, "Pushkit", "http://localhost:1234", null, true);