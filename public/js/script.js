
const commandHistory = [];

function sel(val) {
    return document.querySelector(val);
}

function create(elem) {
    return document.createElement(elem);
}

function write(text) {
    let writeElem = create("p")
    writeElem.textContent = text;
    sel(".result").appendChild(writeElem);
}

sel("#input").addEventListener("keydown", (e) => {

    let text = sel("#input")

    if(e.key === "Enter" && text.value){

        socket.emit("cmd", text.value);

        commandHistory.push(text.value)

        text.value = "";

    }

})

socket.on("result", (returnText, result, frontproc) => {

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
        switch (frontproc[0]) {
            case "eval":
                resultElem.textContent = eval(frontproc[1]);
            break;

            case "reload":
                location.reload();
                return;
            break; //ある方が綺麗だから書いとく

            case "bgcolor":
                document.body.style.backgroundColor = frontproc[1];
                sel("#input").style.backgroundColor = frontproc[1];
            break;

            case "color":
                document.body.style.color = frontproc[1];
                sel("#input").style.color = frontproc[1];
            break;

            case "cmdindex":
                open("../commandindex");
            break;

            case "open":
                open(frontproc[1], "_blank");
            break;

            case "userAgent":
                resultElem.textContent = navigator.userAgent;
            break;

            case "commandhistory":
                sel(".result").appendChild(textElem);
                commandHistory.forEach(text => write(text));
                return;
            break; // また綺麗だから書いとく

            case "savehistory":
                document.cookie = `commandhistory=${commandHistory};max-age=259200`
            break;
        }
    } catch (error) {
        // No Processing
    }

    ifnull ? sel(".result").appendChild(textElem) : true;
    sel(".result").appendChild(resultElem);

    window.scrollTo(0, document.body.scrollHeight)

})