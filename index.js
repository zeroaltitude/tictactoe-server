import express from 'express';
import cors from 'cors';
const app = express();
const port = 3030;
import fs from 'fs';
const GAMEIDLEN = 6;

import { Game } from './movevalidation.js';

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
    const newGameId = String(Math.floor(Math.random() * (10 ** GAMEIDLEN))).padStart(GAMEIDLEN, '0');
    new Game(newGameId, req.body.gameDimension).save();
    res.json({
        "gameID": newGameId
    });
});

app.get("/games/:game_id", (req, res) => {
    const session = new Game(req.params.game_id)
    session.load()
    res.json(session)
});

app.put("/games/:game_id", (req, res) => {
    let playerIdentifier = '';
    const game = new Game(req.params.game_id);
    game.load();
    if (game.isError()) {
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
                console.log("writing to file")
                console.log(game)
                game.save();
                break;
            case "move":
                if (!game.checkMoveValidity(body.move)) {
                    res.json({
                        "error":"move is not valid"
                    });
                    return;
                }
                if (!(((game.moves[game.moves.length-1])??['a','b']).join()==body.move.join())) {
                    game.moves.push(body.move);
                }
                console.log("this is important:")
                console.log(game.getPossibleResponses())
                game.save();
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
                console.log("writing to file")    
                console.log(game)    
                game.save();
                break;
            default:
                res.json({
                    "response": `error action not recognized ${action}`
                });
                return; 
        }
        res.json(game);
    }
});
