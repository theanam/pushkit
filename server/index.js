/// <reference types="./server" />
const webPush  = require("web-push");

/**
 * @type {import('./server')}
 */
module.exports = function createSender({publicKey,privateKey},email){
    webPush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
    let sender  = {webPush}
    sender.send = function(subscription, title = "PusKit", config = {}){
        let message = {
            title,
            config
        }
        return webPush.sendNotification(subscription, JSON.stringify(message));
    }
    return sender;
}