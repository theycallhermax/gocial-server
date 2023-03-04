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

app.listen(port, () => {
    console.log(`Gocial server listening on port ${port}`);
});