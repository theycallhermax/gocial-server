import express from "express";
import JSONdb from "simple-json-db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const app = express();
const db = new JSONdb("db.json");
const port: number = 3000;

/**
* Checks to see if the specified user exists
* @param user The username to check if the user exists
*/
function hasUser(user: any): null | Object {
    let users = db.get("_users");
    let i: number = 0;
    for (i < users.length; i++;) {
        if (users[i].username === user) {
            return users[i];
        }
    }
    return null;
}

app.get("/", (req, res) => {
    res.status(200).send({
        "users": db.get("_users").length,
        "posts": db.get("_home").length
    });
});

app.get("/home", (req, res) => {
    res.status(200).send(db.get("_home"));
});

app.post("/home/post", (req, res) => {
    let home = db.get("_home");
    let user = hasUser(req.headers.username);
    try {
        if (user) {
            // @ts-ignore
            bcrypt.compare(req.headers.password, user.password, (err, result) => {
                if (result == true) {
                    home.push({
                        "username": req.headers.username,
                        "content": req.headers.content,
                        "uuid": uuid(),
                        "created": new Date().getTime()
                    });
                    db.set("_home", home);
                    res.status(201).send({
                        "error": false
                    });
                } else {
                    res.status(403).send({
                        "error": true,
                        "message": "Invalid Password"
                    });
                }
            });
        } else {
            res.send({
                "error": true,
                "message": "Invalid Username"
            });
        }
    } catch(e) {
        res.status(500).send({
            "error": true,
            "message": "Internal Server Error"
        });
    }
});

app.listen(port, () => {
    console.log(`Gocial server listening on port ${port}`);
});