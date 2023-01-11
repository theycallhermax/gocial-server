import express from "express";
import JSONdb from "simple-json-db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import Gocial from "./gocial";

const app = express();
const db = new JSONdb("db.json");
const gocial = new Gocial();

const port: number = 3000;

app.get("/", (req, res) => {
    res.send("");
});

app.post("/create/post", (req, res) => {
    let username = res.get("username");
    let password = res.get("password");
    let content = res.get("content");

    if (gocial.hasUser(username)) {
        
    }
});

app.listen(port);