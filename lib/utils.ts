// @ts-nocheck
/**
* Checks to see if a user exists
* @param {string} user The user to check if exists
* @param {any} db The DB to check in
* @returns A boolean
*/
export function user_exists(user: string, db: any): boolean {
    const users: object[] = db.get("_users");

    for (const i in users) {
        if (users[i].username === user) {
            return true;
        }
    }
    
    return false;
}

/**
* Get's the specified user's profile
* @param {string} user The user to get
* @param {any} db The DB to look in
* @returns The user, or `null`
*/
export function get_user(user: string, db: any): object | null {
    const users: object[] = db.get("_users");

    for (const i in users) {
        if (users[i].username === user) {
            return users[i];
        }
    }

    return null;
}
