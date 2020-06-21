/// <reference types="./binding" />
/**
 * @type {import('./binding')}
 */
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