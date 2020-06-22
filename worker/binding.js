/// <reference types="./binding" />
/**
 * @type {import('./binding')}
 */
function mergeConfigs(c1, c2){
    var final = {}
    if(c1){
        Array.prototype.forEach.call(Object.keys(c1),function(param){
            final[param] = c1[param];
        });
    }
    if(c2){
        Array.prototype.forEach.call(Object.keys(c2),function(param){
            final[param] = c2[param];
        });
    }
    return final;
}
function attach(scope, config, defaultTitle, defaultURL, verbose){
    var last_url = defaultURL || "";
    scope.addEventListener("push", function(event) {
        if(verbose) console.log("Push notification received");
        var data    = event.data.json();
        var title   = data.title  || defaultTitle || "Pushkit";
        var _config = mergeConfigs(config, data.config);
        last_url    = data.url || defaultURL || "";
        event.waitUntil(scope.registration.showNotification(title, _config));
    });
    scope.addEventListener('notificationclick', function(event) {
        if(!last_url) return false;
        event.notification.close();
        event.waitUntil(
            clients.matchAll({ includeUncontrolled: true, type: 'window' }).then( windowClients => {
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    if (client.url.match(last_url) && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(last_url);
                }
            })
        );
    });
}

function attachPushKit(scope, config, defaultTitle, defaultURL, verbose){
    scope.addEventListener("activate",()=>{
        if(Notification && "requestPermission" in Notification){
            // Suggested by: @fa7ad(https://github.com/fa7ad) for some older browser
            verbose && console.log("Requesting Notification permission");
            Notification.requestPermission().then(function(permission){
                if(permission === "granted"){
                    return attach(scope, config, defaultTitle, defaultURL, verbose);
                }
                verbose && console.error("Push permission request denied");
            }).catch(function(e){
                verbose && console.error("Push permission request failed");
            });
        }
        else{
            return attach(scope, config, defaultTitle, defaultURL, verbose);
        }
    });
}