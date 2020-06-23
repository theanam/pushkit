# A complete toolkit for setting up independent Web Push notification.

Everything you need to enable Web Push Notification in your Node.JS web application. Uses the browser's delivery channel to send push notification(Free of cost), which means no extra third-party service (except for the browser's own delivery channel). Works with Progressive Web Apps (PWA). 

## 🌍 [Check the client example](https://theanam.github.io/pushkit)

## 🚀 [Check the server example and tester](https://pushkit.herokuapp.com/)

## Generate your VAPID keys first: 
Before starting the setup, you need to create own own VAPID key pair. This is extremely easy. There are many ways to do it:

1. Generate it from [Pushkit Server example and Tester](https://pushkit.herokuapp.com/)
2. Generate online from [this site](https://web-push-codelab.glitch.me/)
3. Using this tool: [web-push](https://www.npmjs.com/package/web-push)

Once you have your VAPID key pair (Public and Private key). You need to store them carefully. you have to use them to setup your web push implementation in server and client.

## Installation
This package contains both the client and server tools packaged in their own module loading format. To install the package run this:
```shell
yarn add pushkit
```

## Client Setup: 
Pushkit works with the Service Worker API. It's journey starts when the service worker gets registered. Below is an example code that sets up pushkit with the service worker registration and sends the Push Registration information (URL and key to send push notification payload) to the server using the fetch API. You can use it like this, or use a different method to preserve the Push Registration object. (Which is Serializable). Once a browser generates this, it can be used to send push notification to that browser.

```js
import {PushKit} from "pushkit/client";
// create an instance
let pkInstance = new PushKit("PUBLIC_VAPID_KEY", true);
// register service worker
function startPushReg(){
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
        });
    });
}
// Run this after at least one user interaction.
// e.g: a button click. Otherwise there's a chance that it will fail.
document.querySelector(".subscribe").addEventListener("click", startPushReg);
// You can hide this button using `pkInstance.granted` property. granted === already set up
if(pkInstance.granted){
    document.querySelector(".subscribe").style.display = "none";
}
```
The above code creates a `PushKit` Instance, The constructor takes two arguments, The first argument is required. The second argument is false by default, setting it true will generate logs in console.

```js
let _pk = new PushKit("<PUBLIC_VAPID_KEY>", [verbose = false]);
```

The registration of service worker is not included in the plugin itself. This is to avoid getting in the user's way. Besides it's simple. The method `navigator.serviceWorker.register` takes the service worker file (more in this later) and returns a promise. This promise is resolved with a `ServiceWorkerRegistration` object. 

```js
pushKitInstance.handleRegistration(ServiceWorkerRegistration)
```
this also returns a promise that resolves either with a `null` if the user denies, or push is not supported or there's any error. Or the push registration.

The registration object is **different for every user and every browser**. You have to send this registration object to the server and store it there for that user. In the example, `fetch` was used to do it. This registration object will be used to send push notification to that user. [See this section](#sending-push-notification-sender.send)

#### Pushkit Instance
Once created, a PushKit instance has these following properties:

|Property|Type|Description|
|--------|----|-----------|
|granted|Boolean|Determines if push permission is already granted.<br> Can be used for hiding prompts|
|handleRegistration|Function|Helper function to handle push registration|
|reg|`serviceWorkerRegistration`<br> Object|The PushRegistration object.<br> Available after calling `handleRegistration`|
|sub|`PushSubscription`<br> Object| The pushSubscription object.<br> Available after calling `handleRegistration`|
|subscribed|Boolean|Determines if the user is subscribed.<br> Available after calling `handleRegistration`|
|supported|Boolean|Determines if push notification is supported by the browser|

### Using from a CDN:
*If you are not using a module bundler, or you'd like to use a CDN for the frontend part instead, you can manually add the script tag in your HTML file like this:*

```html
<script src="https://unpkg.com/pushkit@3.1.3/client/dist/index.js"></script>
```
> If you chose to include the JavaScript file in your HTML, instead of calling `new PushKit()` you have to call `new pushKit.PushKit()`. Every other frontend API are the same.

## Server Setup
To set up the server, install the `pushkit` package on the server as well and then it can be imported like this:

```js
const createSender  = require("pushkit/server");
let sender     = createSender({
    publicKey  : "PUBLIC_VAPID_KEY",
    privateKey : "PRIVATE_VAPID_KEY"
},"your@email.address");
```
The Email Address is requred for web push API. Once instance of sender is enough for one set of vapid key (one application).
### Sending Push Notification from server `sender.send`:
 ```js
 sender.send(pushRegistrationObject, title, [config]);
```
```js
let config = {
    body: "Street dogs don't want anything more than love and shelter."
}
// Here, the `pushRegistrationObject` is the object sent from the client that was stored on the server.
// Make sure to parse the pushRegistrationObject from JSON string
sender.send(pushRegistrationObject,"Adopt a street dog today!", config);
```

## Configuring Push Behavior:
The `config` object can be used to customize the behaviour of the push notification. These can be sent from the server as per-message basis or can be set in the service worker binding as default. Settings sent from server will always get precedence over default settings.

| property | Data Type | description |
|----------|-----------|-------------|
|body| String|Text to show in the notification body| 
|badge|String|URL of an image to be used as badge,<br> mostly in mobile devices|
|dir|String|Useful if you want to determine the text direction,<br> default is `auto`. <br>It can be set to `ltr`, or `rtl`|
|icon|String|URL of an image to be used as the <br> icon of the notification|
|image|String|URL of an image to be showin in the<br> notification body (for notification with image content)|
|lang|String|A [BCP47](https://tools.ietf.org/html/bcp47) Language code<br> for the notification language|
|renotify|Boolean|Used with the `tag` property,<br> if set to will renotify for all the <br>notification on the same tag|
|requireInteraction|Boolean|Determine if the notification REQUIRES user<br> to interact before it disappears, use it responsibly|
|silent|Boolean|When set to true, notifications will<br> not play notification sound or vibrate|
|tag|String|Useful when you want to group notification<br> on the same topic. e.g: chat from the<br> same person, just set a common tag|
|timestamp|Number|Determines when the notification is created,<br> useful for figuring out how long it took to deliver|
|vibrate|Array of Number|Determines a vibration pattern to use,<br> each number represents milleseconds <br> of vibration e.g: [200,100,100]|

A more detailed documentation on the config options are here: <https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification>

## Setting up the service worker
The last piece of puzzle is to set up a service worker. Now if you are using a boilerplate/generator there's a chance that you already have a service worker. A service worker is a JavaScript file that gets loaded in the client in such a way, that it can still remain active even after you've left the web application. That's why Service workers can receive push notifications. In the client setup section we used a service worker file called `sw.js`, the URL should be accessible from the browser and have to be on the same domain (for security reasons). 

If you don't have a service worker, create one, if you have one, open it, and import the piece of code required to initiate the service Worker. You can either use it from CDN, or download the `worker/binding.js` file from the repository and import it. 
```js
importScripts("https://unpkg.com/pushkit@3.1.3/worker/binding.js"); 
```
Then you can attach the pushkit listeners with your service worker like this:
```js
attachPushKit(self, pushConfig, [defaultTitle = "", defaultURL = "",customClickHandler = null,  verbose = false]);
```
|Argument|Required|Default|Description|
|--------|--------|-------|-----------|
|self|true|n/a|The service worker context<br>the value will always be `self`|
|pushConfig|false|null|Default behavior of push messages. <br> See [Configuring Push behavior](#configuring-push-behavior) |
|defaultTitle|false|""|Default Title for Push Messages|
|defaultURL|false|""|Default URL to open or focus <br> when push message is clicked<br> this Will not work if the default click <br>handler is changed|
|customClickHandler|false|null|If you want to change the default <br> click behavior of the push click event. Takes <br> a function and passes the `event` object.|
|verbose|false|false|If set to true, console logs<br> will be generated|

Sample Use in service worker: 

```js
importScripts("https://unpkg.com/pushkit@3.1.3/worker/binding.js"); 
var pushConfig = {
    icon  : "ICON_URL",
    badge : "BADGE_URL"
}
attachPushKit(self, pushConfig);
```
The `PushConfig` object can have any properties from the [Configuring Push Behavior](#configuring-push-behavior)  section above.If the same properties are also sent from the server, server values will get precedence. You can read the full documentation of the available config options here: <https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification>

## Using a different backend:

If your backend is written in a different language, and you want to use Pushkit in the frontend only. You can definitely do that. Pushkit only knows `JSON` push data. You have to send *JSON string* as push data in the following format: 

```json
{
    "title"   : "Push Notification Title",
    "url"     : "https://where-to-go",
    "config"  : {
        "body": "Push notification body"
    }
}
```
This config here can have any value from [here](#configuring-push-behavior), Pushkit will be able to parse this and work without any issues.


> One more thing, Make sure your application is served from a secure origin `https`. otherwise push notification will not work.

**** 
This tool is released under the MIT License. Feel free to contribute.


Made with 💙 and JavaScript
