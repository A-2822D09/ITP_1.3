
const socket = io();

function sel(val) {
    return document.querySelector(val);
}

function resizeInput() {

    let locationWidth = getComputedStyle(sel(".location")).width;
    locationWidth = locationWidth.replace(/px/, "");
    locationWidth = Number(locationWidth);

    sel("#input").style.width = (window.innerWidth - locationWidth) + "px";

}

let loc = location.toString();

loc = loc.replace(/http:\/\//, "");
loc = loc.slice(0, -1);
loc = loc + ">"

sel(".location").textContent = loc;

resizeInput();

window.addEventListener("resize", resizeInput);

socket.emit("userAgent", navigator.userAgent);

if(!document.cookie.includes("allowcookie=true")) {
    const allowcookie = confirm("このサイトでは一部cookieを使用する場合があります。\ncookieの使用に同意いただけない場合は、キャンセルを押して\nこのサイトから退出してください。");
    allowcookie ? document.cookie = "allowcookie=true;max-age=259200" : history.back();
}