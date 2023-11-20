
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

window.addEventListener("resize", resizeInput)