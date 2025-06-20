const express = require('express');
const cors = require('cors');
const app = express();
const port = 3030;
const fs = require('fs');
const GAMEIDLEN = 6;

// Enable CORS with the defined options
app.use(express.json());
app.use(cors()); // Apply the CORS middleware with specific options

//app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get("/games", (req, res) => {
    res.json(req.body);
});

app.post("/games", (req, res) => {
    const newGame = String(Math.floor(Math.random() * (10 ** GAMEIDLEN))).padStart(GAMEIDLEN,'0');
    const content = JSON.stringify({
        "moves": [],
        "gameID": newGame,
        "playerX": "",
        "playerO": "",
        "gameStarted": false,
        "currentPlayer": "X"
    });
    fs.writeFile(`state/games/${newGame}.json`, content, (err) => {
        if (err) {
            console.error("file failed", err);
        }
        else {
            console.log("succesffuclly created");
        }
    });
    res.json({
        "gameID": newGame
    });
});

app.get("/game/:game_id", (req, res) => {
    fs.readFile(`state/games/${req.params.game_id}.json`, (err, data) => {
        if (err) throw err;
        const game = JSON.parse(data);
        res.json(game);
    });
});

app.put("/game/:game_id", (req, res) => {
    let playerIdentifier = '';
    const game = JSON.parse(fs.readFileSync(`state/games/${req.params.game_id}.json`, (err, data) => {
        if (err) throw err;
    }));
    const body = req.body;
    const action = body.action;
    switch (action) {
        case "join":
            const playerName = body.playerName;
            if (game.playerX === '' && game.playerO === '') {
                if (Math.random >= .5) {
                    game.playerX = playerName;
                    playerIdentifier = 'X';
                }
                else {
                    game.playerO = playerName;
                    playerIdentifier = 'O';
                }
            }
            else if (game.playerX === '') {
                game.playerX = playerName;
                game.gameStarted = true;
                playerIdentifier = 'X';
            }
            else if (game.playerO === '') {
                game.playerO = playerName;
                game.gameStarted = true;
                playerIdentifier = 'O';
            }
            else {
                res.json({
                    "response":"game is full"
                });
                return;
            }
            res.json({
                "playerIdentifier": playerIdentifier
            });
            break;
        case "move":
            if (game.playerX === '' || game.playerO === '') {
                res.json({
                    "response": "a player is missing"
                });
                return;
            }
            console.log(game.currentPlayer);
            game.moves.push(body.move);
            game.currentPlayer = body.newPlayer;
            console.log(game.currentPlayer);
            break;
        default:
            res.json({
                "response": `error action not recognized ${action}`
            });
            return;
    }
    fs.writeFile(`state/games/${req.params.game_id}.json`,JSON.stringify(game), (err) => {
        if (err) {
            console.error("move failed", err);
        }
        else {
            console.log("move successful");
        }
    });
    res.json(game);
});