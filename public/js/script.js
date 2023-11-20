
const socket = io();

function sel(val) {
    return document.querySelector(val);
}

function create(elem) {
    return document.createElement(elem);
}

sel("#input").addEventListener("keydown", (e) => {

    let text = sel("#input")

    if(e.key === "Enter" && text.value){

        socket.emit("cmd", text.value);

        text.value = "";

    }

})

socket.on("result", (returnText, result, argN) => {

    let ifnull = true;

    let textElem = create("p");
    if (returnText) {
        textElem.textContent = loc + returnText;
        textElem.className = "text";
    } else {
        ifnull = false;
    }
    let resultElem = create("p");
    resultElem.textContent = result;
    resultElem.className = "resulttext";

    try {
        if (argN[0] === "eval") {
            resultElem.textContent = eval(argN[1]);
        }
        if (argN[0] === "reload") {
            location.reload();
            return;
        }
        if (argN[0] === "color") {
            document.body.style.color = argN[1];
            sel("#input").style.color = argN[1];
        }
        if (argN[0] === "bgcolor") {
            document.body.style.backgroundColor = argN[1];
            sel("#input").style.backgroundColor = argN[1];
        }
        // if (argN[0] === "encode") {
        //     if (argN[2] === "/asc2") {
        //         resultElem.textContent = btoa(argN[1]);
        //     } else if (argN[2] === "/uri") {
        //         resultElem.textContent = encodeURIComponent(argN[1]);
        //     }
        // }
    } catch (error) {
        // No Processing
    }

    ifnull ? sel(".result").appendChild(textElem) : true;
    sel(".result").appendChild(resultElem);

})