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
    const newGameId = String(Math.floor(Math.random() * (10 ** GAMEIDLEN))).padStart(GAMEIDLEN,'0');
    const content = JSON.stringify({
        "moves": [],
        "gameID": newGameId,
        "playerX": "",
        "playerO": "",
        "gameStarted": false,
        "gameDimension": req.body.gameDimension,
        "playerWhoRequestedUndo": ''
    });
    fs.writeFile(`state/games/${newGameId}.json`, content, (err) => {
        if (err) {
            console.error("file failed", err);
        }
        else {
            console.log("succesffuclly created");
        }
    });
    res.json({
        "gameID": newGameId
    });
});

app.get("/games/:game_id", (req, res) => {
    fs.readFile(`state/games/${req.params.game_id}.json`, (err, data) => {
        if (err) {
            res.json({'error':err})
        }
        else {
            const game = JSON.parse(data);
            res.json(game);
        }
    });
});

app.put("/games/:game_id", (req, res) => {
    let playerIdentifier = '';
    let game;
    try {
        game = JSON.parse(fs.readFileSync(`state/games/${req.params.game_id}.json`, (err, data) => {
            if (err) {
                return {"error": "no such game"};
            }
        }));
    } catch (e) {
        game = {"error": e};
    }
    if (game.error) {
        res.json(game);
    }
    else {
        const body = req.body;
        const action = body.action;
        switch (action) {
            case "join":
                const playerName = body.playerName;
                if (game.playerX === '' && game.playerO === '') {
                    if (Math.random() >= .5) {
                        game.playerX = playerName;
                        playerIdentifier = 'X';
                    }
                    else {
                        game.playerO = playerName;
                        playerIdentifier = 'O';
                    }
                }
                else if (game.playerX === '') {
                    // set player name (duplicate name support)
                    game.playerX = game.playerO === playerName ? `${playerName}(1)` : playerName;
                    game.gameStarted = true;
                    playerIdentifier = 'X';
                }
                else if (game.playerO === '') {
                    game.playerO = game.playerX === playerName ? `${playerName}(1)` : playerName;
                    game.gameStarted = true;
                    playerIdentifier = 'O';
                }
                else if (playerName === game.playerX || playerName === game.playerO) {
                    res.json({
                        "response": "already started",
                        "playerIdentifier": ((playerName === game.playerX) ? 'X' : 'O'),
                        "gameDimension": game.gameDimension
                    });
                }
                else {
                    res.json({
                        "response":"game is full"
                    });
                    return;
                }
                res.json({
                    "playerIdentifier": playerIdentifier,
                    "gameDimension": game.gameDimension
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
                console.log(body.move, "||", game.moves);
                if (!(((game.moves[game.moves.length-1])??['a','b']).join()==body.move.join())) {
                    game.moves.push(body.move);
                }
                console.log(game.currentPlayer);
                break;
            // by far the worst code ive ever written tbh: 
            case "undoMove":
                console.log(body.playerWhoRequestedUndo, game.playerX, game.playerO)
                if (!(body.playerWhoRequestedUndo === game.playerX || body.playerWhoRequestedUndo === game.playerO || body.playerWhoRequestedUndo === '')) {
                    res.json({
                        "response": `player who requested not in game`
                    });
                    break;
                }
                if (game.playerWhoRequestedUndo === '' && (((body.playerWhoRequestedUndo === game.playerO) && game.moves.length % 2 === 1) || ((body.playerWhoRequestedUndo === game.playerX) && game.moves.length % 2 === 0))) {
                    res.json({
                        "response": `cannot undo opponents move`
                    });
                    break;
                }
                if ((game.playerWhoRequestedUndo === '' || body.playerWhoRequestedUndo === game.playerWhoRequestedUndo) && body.confirmUndo === null) {
                    game.playerWhoRequestedUndo = body.playerWhoRequestedUndo;
                    res.json({
                        "response": `undo requested`
                    });
                    break;
                }
                if (body.playerWhoRequestedUndo !== game.playerWhoRequestedUndo && body.confirmUndo === null) {
                    //toggle off without confirming or unconfirming
                    game.playerWhoRequestedUndo = '';
                    res.json({
                        "response": 'undo ask toggled off'
                    })
                    break;
                }
                if (body.playerWhoRequestedUndo !== game.playerWhoRequestedUndo && body.confirmUndo) {
                    game.moves.pop();
                    res.json({
                        "response": `move undone`
                    });
                    break;
                }
                res.json({
                    "response": `undo denied`
                });
                break;
            //THIS IS FOR DEBUGGING ONLY ~~ REMOVE LATER
            case "setMoves":
                game.moves = body.moves;
                break;
            default:
                res.json({
                    "response": `error action not recognized ${action}`
                });
                return;
            
        }
        console.log("writing to file")
        fs.writeFile(`state/games/${req.params.game_id}.json`,JSON.stringify(game), (err) => {
            if (err) {
                console.error("move failed", err);
            }
            else {
                console.log("move successful");
            }
        });
        res.json(game);
    }
});
