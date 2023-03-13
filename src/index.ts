// @ts-nocheck
import express from "express";
import JSONdb from "simple-json-db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { get_user, user_exists } from "../lib/utils.js";
import body_parser from "body-parser";

const app = express();
const db = new JSONdb("db.json");
const port = 3000;

app.get("/", (req, res) => {
    res.status(200).send({
        "users": db.get("_users").length,
        "posts": db.get("_home").length
    });
    res.end();
});

app.get("/home", (req, res) => {
    res.status(200).send({ "code": 200, "home": db.get("_home") });
    res.end();
});

app.post("/home/post", body_parser.json(), (req, res) => {
    if (user_exists(req.body.username, db)) {
        const user: object = get_user(req.body.username, db);

        bcrypt.compare(req.body.password, user.password, (err: Error, result: boolen) => {
            if (result === true) {
                const home: object[] = db.get("_home");

                home.push({
                    "username": req.body.username,
                    "content": req.body.content,
                    "uuid": uuid(),
                    "created": new Date().getTime()
                });

                res.status(201).send({ "code": 201 });
                res.end();
            } else {
                res.status(401).send({ "code": 401, "message": "Invalid Password" });
                res.end();
            }
        });
    } else {
        res.status(401).send({ "code": 401, "message": "Invalid Username" });
        res.end();
    }
});

app.get("/users/:id", (req, res) => {
    if (user_exists(req.params.id, db)) {
        const user: object = get_user(req.params.id, db);
        delete user.password; // Not today, hackers!
        user.code = 200;
        res.status(200).send(user);
        res.end();
    } else {
        res.status(404).send({ "code": 404 });
        res.end();
    }
});

app.listen(port, () => {
    console.log(`Gocial server listening on port ${port}`);
});