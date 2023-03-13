# Gocial Server
The server for Gocial
## Running
```bash
npm install
npm run start
```
## Documentation
### `/`
Shows the current stats
### `/home`
Shows all of the home posts
### `/home/post`
Post to home
#### Body
```json
{
    "username": "[username here]",
    "password": "[password here]",
    "content": "[post content here]"
}
```