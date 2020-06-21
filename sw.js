importScripts("https://unpkg.com/pushkit@2.0.1/worker/binding.js"); 
var pushOptions = {
    title : "Pushkit Sample",
    icon  : "/pushkit/pushkit.png",
    badge : "/pushkit/pushkit.png"
}
attachPushKit(self, pushOptions);