/// <reference types="./index" />
const webPush  = require("web-push");

/**
 * @type {import('./index')}
 */
module.exports = function createSender({publicKey,privateKey},email){
    webPush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
    let sender  = {webPush}
    sender.send = function(subscription, message){
        return webPush.sendNotification(subscription,message);
    }
    return sender;
}