import { WebSocketServer } from "ws";
import JSONdb from "simple-json-db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const wss = new WebSocketServer({ port: 8080 });
const db = new JSONdb("db.json");

wss.on("connection", (ws) => {
    ws.on("message", (data: any) => {
        var data: any = JSON.parse(data);
        console.log(`New message: ${data}`);
        if (data.cmd === "post") {
            var users: any = db.get("_users");
            var hasUser: boolean = false;
            let i: number = 0;
            for (i < users.length; i++;) {
                if (users[i].username === data.username) {
                    var hasUser: boolean = true;
                    break;
                }
            }
            
            bcrypt.compare(data.password, users[i].password, (err, result) => {
                if (result == true) {
                    ws.send(JSON.stringify({"cmd": "ok"}));
                    var home = db.get("_home");
                    home.push({"username": JSON.parse(data).username, "content": JSON.parse(data).val, "uuid": uuid(), "created": new Date().getTime()});
                    db.set("_home", home);
                    wss.clients.forEach((client) => {
                        client.send(JSON.stringify({"cmd": "message", "username": JSON.parse(data).username, "val": JSON.parse(data).val}));
                    });
                } else {
                    ws.send(JSON.stringify({"cmd": "error", "val": "Invalid Username or Password"}));  
                }
            });
        } else if (data.cmd === "signup") {
            var users: any = db.get("_users");
            var hasUser: boolean = false;
            let i: number = 0;
            for (i < users.length; i++;) {
                if (users[i].username === data.username) {
                    var hasUser: boolean = true;
                    break;
                }
            }
            
            if (hasUser) {
                ws.send(JSON.stringify({"cmd": "status", "val": "Account Exists"}));
            } else {
                bcrypt.hash(data.password, 14, (err, hash) => {
                    users.push({"username": data.username, "password": hash, "uuid": uuid(), "created": new Date().getTime()});
                    db.set("_users", users);
                    ws.send(JSON.stringify({"cmd": "ok"}));
                });
            }
        } else if (data.cmd === "login") {
            var users: any = db.get("_users");
            var hasUser: boolean = false;
            let i: number = 0;
            for (i < users.length; i++;) {
                if (users[i].username === data.username) {
                    var hasUser = true;
                    break;
                }
            }
            
            if (!(hasUser)) {
                ws.send(JSON.stringify({"cmd": "error", "val": "Invalid Username or Password"}));
            } else {
                bcrypt.compare(data.password, db.get("_users")[i].password, (err, result) => {
                    if (result == true) {
                        ws.send(JSON.stringify({"cmd": "ok"}));
                    } else {
                        ws.send(JSON.stringify({"cmd": "error", "val": "Invalid Username or Password"}));  
                    }
                });
            }
        } else if (data.cmd === "ping") {
            ws.send(JSON.stringify({"cmd": "ping", "val": "OK"}));
        } else if (data.cmd === "home") {
            ws.send(JSON.stringify({"cmd": "home", "val": db.get("_home"), "len": (db.get("_home").length - 1)}));
        } else {
            ws.send(JSON.stringify({"cmd": "error", "val": "Invalid Request"}));
        }
    });
});