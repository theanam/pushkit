# A complete toolkit for setting up independent Web Push notification.

Everything you need to enable Web Push Notification in your Node.JS web application or Progressive web application, without any third-party service. 

## 🌍[Check the client example](https://theanam.github.io/pushkit)

## 🚀[Check the server example](https://pushkit.herokuapp.com/)

## Installation
This package contains both the client and server tools packaged in their own module loading format. To install the package run this:
```shell
yarn add pushkit
```
### Generate your VAPID keys first: 
Before starting the setup, you need to create own own VAPID key pair. This is extremely easy to do. You can go to [this site](https://web-push-codelab.glitch.me/) and generate them online. Or you can generate them from Command line using [this tool](https://www.npmjs.com/package/web-push)

Once you have your VAPID key pair (Public and Private key), you can use them to setup your web push implementation. 

### Client Setup: 
Once you have installed the package, you can use it like this: 

```js
import {PushKit} from "pushkit/client";
// create an instance
let pkInstance = new PushKit("PUBLIC_VAPID_KEY", true);
// register service worker
navigator.serviceWorker.register("./sw.js").then(swreg=>{
    // start push registration after service worker registration
    pkInstance.handleRegistration(swreg).then(pushreg=>{
        // Once push registration is done
        // Send the registration data to the server
        // You can implement this part in your convenient way
        // The below example uses `fetch` API to do it.
        let regData = JSON.stringify(pushreg);
        fetch("/reg", {
            method  : "POST",
            body    : regData,
            headers : {
                "content-type":"application/json"
            }
        });
    })
```
The above code creates a `PushKit` Instance, The constructor takes two arguments, The first argument is required. The second argument is false by default, setting it true will generate console logs.

```js
let _pk = new PushKit("<PUBLIC_VAPID_KEY>", [verbose = false]);
```

The registration of service worker is not included in the plugin itself. This is to avoid getting in the user's way. Besides it's simple. The method `navigator.serviceWorker.register` takes the service worker file (more in this later) and returns a promise. This promise is resolved with a `ServiceWorkerRegistration` object. 

```js
pushKitInstance.handleRegistration(ServiceWorkerRegistration)
```
this also returns a promise that resolves either with a `null` if the user denies, or push is not supported or there's any error. Or the push registration.

The registration object is different for every user and every browser. You have to send this registration object to the server and store it there for that user. In the example, `fetch` was used to do it. This registration object will be used to send push notification to that user.

#### Using from a CDN:
*If you are not using a module bundler, or you'd like to use a CDN for the frontend part instead, you can manually add the script tag in your HTML file like this:*

```html
<script src="https://unpkg.com/pushkit@2.0.8/client/dist/index.js"></script>
```
> If you chose to include the JavaScript file in your HTML, instead of calling `new PushKit()` you have to call `new pushKit.PushKit()`. Every other frontend API are the same.


### Server Setup
To set up the server, install the `pushkit` package on the server as well and then it can be imported like this:

```js
const createSender  = require("pushkit/server");
let sender     = createSender({
    publicKey  : "PUBLIC_VAPID_KEY",
    privateKey : "PRIVATE_VAPID_KEY"
},"your@email.address");
```
The Email Address is requred for web push API. Once instance of sender is enough for one set of vapid key (one application).

Now when you need to send Push notification, Just use the `send` method of the
`sender` like this:

```js
// Make sure the parse the pushRegistrationObject from JSON string
sender.send(pushRegistrationObject,"hello world. this is a push message");
```

Here, the `pushRegistrationObject` is the object sent from the client that was stored on the server.

### Setting up the service worker
The last piece of puzzle is to set up a service worker. Now if you are using a boilerplate/generator there's a chance that you already have a service worker. A service worker is a JavaScript file that gets loaded in the client in such a way, that it can still remain active even after you've left the web application. That's why Service workers can receive push notifications. In the client setup section we used a service worker file called `sw.js`, the URL should be accessible from the browser and have to be on the same domain (for security reasons). 

If you don't have a service worker, create one, if you have one, open it, and import the piece of code required to initiate the service Worker. You can either use it from CDN, or copy the code there. To use the CDN, paste this in the beginning of your service worker: 
```js
importScripts("https://unpkg.com/pushkit@2.0.8/worker/binding.js"); 
```
##### *Or* paste the below code in the service worker: 
```js
function attachPushKit(scope,config,verbose){
    var title   = config.title || "PushKit";
    var icon    = config.icon  || "";
    var badge   = config.badge || "";
    scope.addEventListener("push", function(event) {
        if(verbose) console.log("Push notification received");
        const options = {
          body  : event.data.text(),
          icon  : icon,
          badge : badge
        };
        event.waitUntil(scope.registration.showNotification(title, options));
      });
    if(config.url){
      scope.addEventListener('notificationclick', function(event) {
        event.notification.close();
        event.waitUntil(
            clients.matchAll({ includeUncontrolled: true, type: 'window' }).then( windowClients => {
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    if (client.url === config.url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(config.url);
                }
            })
        );
      });
    }  
}
```
Either way, you'll end up with the same result. Then add this line anywhere in the worker:
```js
var pushOptions = {
    title : "My Awesome APP",
    icon  : "ICON_URL",
    badge : "BADGE_URL",
    url   : "YOUR_APP_URL"
}
attachPushKit(self, pushOptions);
```
This should be enough to enable web push notification in your application.

**** 
This tool is released under the MIT License. Feel free to contribute.


Made with 💙 and JavaScript
