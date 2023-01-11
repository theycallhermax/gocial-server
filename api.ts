import express from "express";
import JSONdb from "simple-json-db";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const app = express();
const db = new JSONdb("db.json");
const port: number = 3000;

app.get("/", (req, res) => {
    res.send("");
});

app.post("/create/post", (req, res) => {
    let username: string = res.getHeader("username");
    let password: string = res.getHeader("password");
    let content: string = res.getHeader("content");

    
});

app.listen(port);