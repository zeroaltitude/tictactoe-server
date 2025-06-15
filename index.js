const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get("/accounts", (req, res) => {

});

app.post("/accounts", (req, res) => {

});

app.get("/account/:account_id", (req, res) => {

});

app.put("/account/:account_id", (req, res) => {

});

app.get("/games", (req, res) => {

});

app.post("/games", (req, res) => {

});

app.get("/game/:game_id", (req, res) => {

});

app.put("/game/:game_id", (req, res) => {

});

app.get("/game/:game_id/moves", (req, res) => {

});

app.post("/game/:game_id/moves", (req, res) => {

});
