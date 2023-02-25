import express from "express";
import JSONdb from "simple-json-db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const app = express();
const db = new JSONdb("db.json");
const port: number = 3000;

app.get("/", (req, res) => {
    res.status(200).send({
        "users": db.get("_users").length,
        "posts": db.get("_home").length
    });
    res.end();
});

app.get("/home", (req, res) => {
    res.status(200).send(db.get("_home"));
    res.end();
});

app.post("/home/post", (req, res) => {
    let users = db.get("_users");
    let hasUser: boolean = false;
    let i: number = 0;
    for (i < users.length; i++;) {
        if (users[i].username === data.username) {
            hasUser = true;
            break;
        }
    }

    let home = db.get("_home");
    try {
        if (hasUser) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    home.push({
                        "username": req.headers["username"],
                        "content": req.headers["content"],
                        "uuid": uuid(),
                        "created": new Date().getTime()
                    });
                    db.set("_home", home);
                    res.status(201).send({
                        "error": false
                    });
                    res.end();
                } else {
                    res.status(403).send({
                        "error": true,
                        "message": "Invalid Password"
                    });
                    res.end();
                }
            });
        } else {
            res.send({
                "error": true,
                "message": "Invalid Username"
            });
            res.end();
        }
    } catch(e) {
        res.status(500).send({
            "error": true,
            "message": "Internal Server Error"
        });
    }
});

/*
app.get("/users/:user", (req, res) => {
    let user = hasUser(req.params.user);
    if (user) {
        // @ts-ignore
        delete user.password;
        res.status(200).send(user);
        res.end();
    } else {
        res.status(500).send({
            "error": true,
            "message": "Not Found"
        });
        res.end();
    }
});
*/

app.listen(port, () => {
    console.log(`Gocial server listening on port ${port}`);
});