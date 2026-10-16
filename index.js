import express from 'express';
import cors from 'cors';
const app = express();
const port = 3030;
const GAMEIDLEN = 6;
const BOTNAME = "tictactimmy";

import { Game, isDuplicateId } from './datamanagement.js';
import { getNextMove } from './montecarlotreesearch.js';

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
    let newGameId = String(Math.floor(Math.random() * (10 ** GAMEIDLEN))).padStart(GAMEIDLEN, '0');
    while (isDuplicateId(newGameId)) {
        newGameId = String(Math.floor(Math.random() * (10 ** GAMEIDLEN))).padStart(GAMEIDLEN, '0');
    }
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
                game.isComputerGame = false;
                const playerName = body.playerName;
                if (game.playerX === '' && game.playerO === '') {
                    if (body.playerIdentifier === 'X') {
                        game.playerX = playerName;
                    }
                    else if (body.playerIdentifier === 'O') {
                        game.playerO = playerName;
                    }
                    else {
                        if (Math.random() >= .5) {
                            game.playerX = playerName;
                        }
                        else {
                            game.playerO = playerName;
                        }
                    }
                }
                else if (game.playerX === '') {
                    // set player name (duplicate name support)
                    game.playerX = game.playerO === playerName ? `${playerName}(1)` : playerName;
                    game.gameStarted = true;
                }
                else if (game.playerO === '') {
                    game.playerO = game.playerX === playerName ? `${playerName}(1)` : playerName;
                    game.gameStarted = true;
                }
                else if (playerName === game.playerX || playerName === game.playerO) {
                    res.json({
                        "response": "already started",
                        "playerIdentifier": game.playerX === playerName ? 'X' : 'O'
                    });
                }
                else {
                    res.json({
                        "response":"game is full"
                    });
                    return;
                }
                const playerIdentifier = game.playerX === playerName ? 'X' : 'O';
                res.json({
                    "response": `game joined as ${playerIdentifier}`,
                    "playerIdentifier": `${playerIdentifier}`
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
                if (game.isComputerGame && !game.gameHasEnded) {
                    const selectedMove = getNextMove(game.getBoardFromStoredMoves(), game.playerX === BOTNAME ? 'X' : 'O', game.botDifficulty)
                    if (selectedMove.length === 0) {
                        game.gameHasEnded = true;
                    }
                    else {
                        game.moves.push(selectedMove.split(',').map(Number));
                    }
                }
                game.save();
                break;
            case "playComputer":
                const humanName = body.playerName;
                if (body.playerIdentifier === 'X') {
                    game.playerO = BOTNAME;
                    game.playerX = humanName === BOTNAME ? `${BOTNAME}(1)` : humanName;
                }
                else if (body.playerIdentifier === 'O') {
                    game.playerX = BOTNAME;
                    game.playerO = humanName === BOTNAME ? `${BOTNAME}(1)` : humanName;
                }
                else {
                    if (Math.random() >= .5) {
                        game.playerO = BOTNAME;
                        game.playerX = humanName === BOTNAME ? `${BOTNAME}(1)` : humanName;
                    }
                    else {
                        game.playerX = BOTNAME;
                        game.playerO = humanName === BOTNAME ? `${BOTNAME}(1)` : humanName;
                    }
                }
                game.gameStarted = true;
                game.isComputerGame = true;
                game.botDifficulty = body.botDifficulty;
                const botMove = game.playerX === humanName ? [] : getNextMove(game.getBoardFromStoredMoves(), game.playerX === BOTNAME ? 'X' : 'O', body.botDifficulty).split(',').map(Number);
                if (botMove.length !== 0) {
                    game.moves = [botMove,]
                }
                res.json({
                    "gameDimension": game.gameDimension,
                    "move": game.moves,
                    "playerIdentifier": game.playerX === humanName ? 'X' : 'O'
                });
                game.save();
                break;
            case "undoMove":
                if (game.playerWhoRequestedUndo === '') {
                    game.playerWhoRequestedUndo = body.playerWhoRequestedUndo;
                }
                else {
                    if (body.playerWhoRequestedUndo === '') {
                        game.playerWhoRequestedUndo = '';
                        console.log("clear undo")
                    }
                    else if (game.playerWhoRequestedUndo !== body.playerWhoRequestedUndo) {
                        game.moves.pop();
                        game.playerWhoRequestedUndo = '';
                    }
                    else {
                        res.json({
                            "response": "undo cancelled"
                        })
                    }
                }
                game.save()
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
