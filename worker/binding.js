/// <reference types="./binding" />
/**
 * @type {import('./binding')}
 */
function mergeConfigs(c1,c2){
  var final = {}
  Array.prototype.forEach.call(Object.keys(c1),function(param){
      final[param] = c1[param];
  });
  Array.prototype.forEach.call(Object.keys(c2),function(param){
      final[param] = c2[param];
  });
  return final;
}
function attachPushKit(scope, config, defaultTitle, defaultURL, verbose){
  var old_conf = config || {};
  var last_url = defaultURL || "";
  scope.addEventListener("push", function(event) {
      if(verbose) console.log("Push notification received");
      var data    = event.data.json();
      var title   = data.title  || defaultTitle || "Pushkit";
      var ev_conf = data.config || {};
      var options = mergeConfigs(old_conf, ev_conf);
      last_url    = data.url || defaultURL || "";
      event.waitUntil(scope.registration.showNotification(title, options));
    });
  scope.addEventListener('notificationclick', function(event) {
      if(!last_url) return false;
      event.notification.close();
      event.waitUntil(
          clients.matchAll({ includeUncontrolled: true, type: 'window' }).then( windowClients => {
              for (var i = 0; i < windowClients.length; i++) {
                  var client = windowClients[i];
                  if (client.url.match(url) && 'focus' in client) {
                      return client.focus();
                  }
              }
              if (clients.openWindow) {
                  return clients.openWindow(url);
              }
          })
      );
  });
}