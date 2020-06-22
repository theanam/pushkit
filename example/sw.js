// importScripts("https://unpkg.com/pushkit@3.0.0/worker/binding.js"); 
var pushOptions = {
    icon  : "/pushkit/pushkit.png",
    badge : "/pushkit/pushkit.png"
}
attachPushKit(self, pushOptions);