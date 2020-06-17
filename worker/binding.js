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
}