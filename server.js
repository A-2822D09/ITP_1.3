
const express = require("express");
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
    allowEIO3: true
});

app.use(express.static("public"));

app.get("/", (req, res) => {

    res.set("Access-Control-Allow-Origin", "*");
    res.sendFile(__dirname + "/index.html");

})

io.on("connection", (socket) => {

    socket.on("cmd", (text) => {

        switch (true){

            case text.includes("time"):
                let arg = text.match(/\/.+/);
                try {
                    arg = arg.toString();
                }catch (error) {
                    arg = null;
                }
                switch (arg){
                    case null:
                        io.emit("result", text, new Date())
                    break;
                    default:
                        let NoSlashArg = arg.replace("/", "");
                        io.emit("result", text, new Date().toLocaleString(NoSlashArg));
                }
            break;



            case text.includes("eval"):
                let evalText = text.match(/\`.+\`/);
                let evalarg = text.match(/ \/.+$/)

                try {
                    evalText = evalText.toString();
                    evalText = evalText.replace(/\`/g, "");
                } catch(error) {
                    evalText = null;
                }

                try {
                    evalarg = evalarg.toString();
                    evalarg = evalarg.replace(/ /g, "")
                } catch (error) {
                    evalarg = null;
                }

                if(!evalText || !evalarg){
                    io.emit("result", text, `引数またはevalコマンドの内容を指定してください。`); 
                    return;  
                }
                
                if(evalarg === "/server"){
                    io.emit("result", text, eval(evalText));
                }else if(evalarg === "/front"){
                    io.emit("result", text, null, ["eval", evalText]);
                }else {
                    io.emit("result", text, "無効な引数です。");
                }

            break;



            case text.includes("echo"):
                let echotext = text.match(/\`.+\`/);
                try {
                    echotext = echotext.toString();
                    echotext = echotext.replace(/\`/g, "")
                } catch (error) {
                    echotext = null;
                }
                if(echotext){
                    io.emit("result", text, echotext);
                }else {
                    io.emit("result", text, "'echo'コマンドには文字列が必須です。");
                }
            break;


            case text.includes("reload"):
                if(text.match(/^reload$/)){
                    io.emit("result", text, null, ["reload"]);
                }else if(text.match(/\/.*/)){
                    io.emit("result", text, "このコマンドには引数はありません。");
                }else {
                    io.emit("result", text, `'${text}'はコマンドとして認識されていません。`);
                }
            break;



            case text.includes("bgcolor"):
                let bgcolorval = text.match(/ #[0-9A-Fa-f]{3}$/);
                try {
                    bgcolorval = bgcolorval.toString();
                    bgcolorval = bgcolorval.replace(/ /g, "");
                } catch (error) {
                    io.emit("result", text, "3桁のHEXカラーコードを指定してください。(例: #fff)");
                    return;
                }
                    io.emit("result", text, `背景色は${bgcolorval}に変更されました。`, ["bgcolor", bgcolorval]);
            break;



            case text.includes("color"):
                let colorval = text.match(/ #[0-9A-Fa-f]{3}$/);
                try {
                    colorval = colorval.toString();
                    colorval = colorval.replace(/ /g, "");
                } catch (error) {
                    io.emit("result", text, "3桁のHEXカラーコードを指定してください。(例: #000)");
                    return;
                }
                io.emit("result", text, `文字色は${colorval}に変更されました。`, ["color", colorval]);
            break;



            case text.includes("help"):
                let help = [
                    "time /[arguments] | 時刻を表示します。",
                    "eval \`(JavaScript code)\` /[front, server] | 入力された文字列をJavaScriptのコードとして解釈し、実行します。",
                    "echo \`(text)\` | 入力された文字列を表示します。",
                    "reload | ページを再更新し、リセットします。",
                    "bgcolor (3 digits HEX color code) | 背景色を変更します。",
                    "color (3 digits HEX color code) | 文字色を変更します。",
                    "help | このヘルプを表示します。",
                    "encode /[asc2, uri] | 文字列をエンコードします。",
                    "decode /[asc2, uri] | 文字列をデコードします。"
                ]
                
                for (let count = 0; count <= help.length; count++){
                    count !== 0 ? io.emit("result", null, help[count]) : io.emit("result", text, help[count]);
                }
            break;



            case text.includes("encode"):
                let encodeText = text.match(/\`.+\`/);
                let encodearg = text.match(/ \/.+$/)

                try {
                    encodeText = encodeText.toString();
                    encodeText = encodeText.replace(/\`/g, "");
                } catch(error) {
                    encodeText = null;
                }

                try {
                    encodearg = encodearg.toString();
                    encodearg = encodearg.replace(/ /g, "")
                } catch (error) {
                    encodearg = null;
                }

                if(!encodeText || !encodearg) {
                    io.emit("result", text, "引数またはencodeコマンドの内容を指定してください。"); 
                    return;  
                }
                
                if (encodearg === "/asc2"){
                    try {
                        io.emit("result", text, btoa(encodeText));
                    } catch (error) {
                        io.emit("result", text, `${encodeText}は不正なテキストです。`);
                    }
                } else if (encodearg === "/uri"){
                    try {
                        io.emit("result", text, encodeURIComponent(encodeText));
                    } catch (error) {
                        io.emit("result", text, `${encodeText}は不正なテキストです。`);
                    }
                } else {
                    io.emit("result", text, `${encodearg}は無効な引数です。`);
                }

            break;



            case text.includes("decode"):
                let decodeText = text.match(/\`.+\`/);
                let decodearg = text.match(/ \/.+$/);

                try {
                    decodeText = decodeText.toString();
                    decodeText = decodeText.replace(/\`/g, "");
                } catch (error) {
                    decodeText = null;
                }

                try {
                    decodearg = decodearg.toString();
                    decodearg = decodearg.replace(/ /g, "");
                } catch (error) {
                    decodearg = null;
                }

                if(!decodeText || !decodearg) {
                    io.emit("result", text, "引数またはdecodeコマンドの内容を指定してください。");
                    return;
                }

                if (decodearg === "/asc2") {
                    try {
                        io.emit("result", text, atob(decodeText));
                    } catch (error) {
                        io.emit("result", text, `${decodeText}は不正なテキストです。`);
                    }
                } else if (decodearg === "/uri") {
                    try {
                        io.emit("result", text, decodeURIComponent(decodeText));
                    } catch (error) {
                        io.emit("result", text, `${decodeText}は不正なテキストです。`);
                    }
                } else {
                    io.emit("result", text, `${decodearg}は無効な引数です。`);
                }
            break;

            default:
                io.emit("result", text, `'${text}'はコマンドとして認識されていません。`);
            break;

        }
        
    })

})

server.listen(3000);