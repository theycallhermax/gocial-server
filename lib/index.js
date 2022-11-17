const ws = new WebSocket("wss://Gocial-Server.mdwalters.repl.co/");
ws.addEventListener("message", function message(data) {
    if (JSON.parse(data).cmd === "message") {
        const user = document.createElement("h3");
        const post = document.createElement("p");

        const userNode = document.createTextNode(JSON.parse(data).username);
        const postNode = document.createTextNode(JSON.parse(data).val);

        user.appendChild(userNode);
        post.appendChild(postNode);
    }
});