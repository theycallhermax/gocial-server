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
function hasUser(user: string): null | Object {
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
    res.send({
        "users": db.get("_users").length,
        "posts": db.get("_home").length
    });
});

app.get("/home", (req, res) => {
    res.send(db.get("_home"));
});

/* Do not uncomment for now
app.post("/home/post", (req, res) => {
    let home: Object[] = db.get("_home");
    let user = hasUser(req.header);
    try {
        if (user) {
            // @ts-ignore
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result == true) {
                    home.push({
                        "username": req.body.username,
                        "content": req.body.content,
                        "uuid": uuid(),
                        "created": new Date().getTime()
                    });
                    db.set("_home", home);
                } else {
                    res.send({
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
*/

app.listen(port, () => {
    console.log(`Gocial server listening on port ${port}`);
});