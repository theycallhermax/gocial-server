import bcrypt from "bcrypt";
import JSONdb from "simple-json-db";

const db = new JSONdb("db.json");

export default class Gocial {
    hasUser(username: string) {
        let users = db.get("_users");
        let hasUser: boolean = false;
        let i: number = 0;
        for (i < users.length; i++;) {
            if (users[i].username === username) {
                return true;
                break;
            }
        }
        return false;
    }
}