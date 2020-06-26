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
function handleNotificationClick(event, last_url) {
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
}
function attachPushKit(scope, config, defaultTitle, defaultURL, customClickHandler, verbose){
    var last_url = defaultURL || "";
    scope.addEventListener("push", function(event) {
        if(verbose) console.log("Push notification received");
        var data    = null;
        var is_json = false;
        try{
            data    = event.data.json();
            is_json = true;
            verbose && console.log("Received JSON Notification");
        }
        catch(e){
            data    = event.data.text();
            verbose && console.log("Received Text");
        }
        var title   = data.title  || defaultTitle || "Pushkit";
        var _config = {}
        if(is_json)  _config = mergeConfigs(config, data.config);
        else _config = mergeConfigs(config,{ body: data });
        last_url     = data.url || defaultURL || "";
        event.waitUntil(scope.registration.showNotification(title, _config));
    });
    scope.addEventListener('notificationclick', function(event){
        if(customClickHandler) customClickHandler(event);
        else handleNotificationClick(event, last_url);
    });
}
function _reject(err,verbose){
    verbose && console.log("Permission failed", err);
}