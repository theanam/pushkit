import {PushKit} from "../client/dist/index";
import Clipboard from "clipboard";
let pubKey = "BK83EbzbKBq5ok1lFeLLeNIDLIqK8rLpVfXxvkyxzavwtMxZs20VNdqnvC7GZgUFpDYd9hGFX297FNL62KqtfeA";
let _pk = new PushKit(pubKey);
console.log(_pk);
const $ = (selector) => document.querySelector(selector);
function msg(message){
    $(".loader").classList.add("hidden");
    $(".main").classList.remove("hidden");
    $(".main .message").innerHTML = message;
}
function success(message,reg){
    msg(message);
    $(".regobj").value = JSON.stringify(reg);
    $(".controls").classList.remove("hidden");
    new Clipboard(".copy");
    // additional work
}
function register(){
    $(".startbtn").classList.add("hidden");
    $(".loader").classList.remove("hidden");
    if(!_pk.supported) return msg("Web Push is not supported in your browser");
    if(navigator.serviceWorker){
        navigator.serviceWorker.register("sw.js").then(reg=>{
            _pk.handleRegistration(reg, true).then(pushdata=>{
                console.log(pushdata);
                if(!pushdata) return msg("Push Registration failed");
                return success("Push Registration successful. Here's your push registration information:", pushdata);
            });
        })
        .catch(e=>{
            msg("Service worker registration failed");
        })
    }
}

$(".start").addEventListener("click",()=>{
    register();
});

window.onload = function(){
    if(_pk.granted) register();
}