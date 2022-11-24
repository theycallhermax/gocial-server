import { WebSocketServer } from "ws";
import JSONdb from "simple-json-db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const wss = new WebSocketServer({ port: 8080 });
const db = new JSONdb("db.json");

wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
        console.log(`New message: ${data}`);
        if (JSON.parse(data).cmd === "post") {
            var users = db.get("_users");
            var hasUser = false;
            let i = 0;
            for (i in users) {
                if (users[i].username === JSON.parse(data).username) {
                    var hasUser = true;
                    break;
                }
            }
            
            bcrypt.compare(JSON.parse(data).password, users[i].password, function(err, result) {
                if (result == true) {
                    ws.send(JSON.stringify({"cmd": "ok"}));
                    var home = db.get("_home");
                    home.push(`${JSON.parse(data).username}: ${JSON.parse(data).val}`);
                    db.set("_home", home);
                    wss.clients.forEach(function each(client) {
                        client.send(JSON.stringify({"cmd": "message", "username": JSON.parse(data).username, "val": JSON.parse(data).val}));
                    });
                } else {
                    ws.send(JSON.stringify({"cmd": "error", "val": "Invalid Username or Password"}));  
                }
            });
        } else if (JSON.parse(data).cmd === "signup") {
            var users = db.get("_users");
            var hasUser = false;
            let i = 0;
            for (i in users) {
                if (users[i].username === JSON.parse(data).username) {
                    var hasUser = true;
                    break;
                }
            }
            
            if (!(hasUser)) {
                ws.send(JSON.stringify({"cmd": "status", "val": "Account Exists"}));
            } else {
                bcrypt.hash(JSON.parse(data).password, 14, function(err, hash) {
                    var users = db.get("_users");
                    users.push({"username": JSON.parse(data).username, "password": hash, "uuid": uuid(), "created": new Date().getTime()});
                    db.set("_users", users);
                    ws.send(JSON.stringify({"cmd": "ok"}));
                });
            }
        } else if (JSON.parse(data).cmd === "login") {
            var users = db.get("_users");
            var hasUser = false;
            let i = 0;
            for (i in users) {
                if (users[i].username === JSON.parse(data).username) {
                    var hasUser = true;
                    break;
                }
            }
            
            if (!(hasUser)) {
                ws.send(JSON.stringify({"cmd": "error", "val": "Invalid Username or Password"}));
            } else {
                bcrypt.compare(JSON.parse(data).password, db.get("_users")[i].password, function(err, result) {
                    if (result == true) {
                        ws.send(JSON.stringify({"cmd": "ok"}));
                    } else {
                        ws.send(JSON.stringify({"cmd": "error", "val": "Invalid Username or Password"}));  
                    }
                });
            }
        } else if (JSON.parse(data).cmd === "ping") {
            ws.send(JSON.stringify({"cmd": "ping", "val": "OK"}));
        } else if (JSON.parse(data).cmd === "home") {
            ws.send(JSON.stringify({"cmd": "home", "val": db.get("_home"), "len": (db.get("_home").length - 1)}));
        } else {
            ws.send(JSON.stringify({"cmd": "error", "val": "Invalid Request"}));
        }
    });
});