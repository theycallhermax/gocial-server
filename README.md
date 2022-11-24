# Gocial Server
The server for Gocial
## Running
```bash
npm install
node .
```

Then connect to `wss://localhost:3000/` with a WebSocket client.
## Documentation
### Commands
#### Log in
Checks to see if the user exists

`{"cmd": "login", "username": "[username]", "password": "[password]"}`
#### Sign up
Creates a new user

`{"cmd": "signup", "username": "[username]", "password": "[password]"}`
#### Home
Gets a list of posts

`{"cmd": "home"}`
#### Ping
"Pings" the server, sort of like keepalive

`{"cmd": "ping"}`
#### Post
Sends a post to home

`{"cmd": "post", "username": "[username]", "password": "[password]", "val": "[content]"}`
#### Set Quote
Sets a quote for the specified user

`{"cmd": "set_quote", "username": "[username]", "password": "[password]", "val": "[content]"}`