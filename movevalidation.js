import { getTreeNodeForCoords, calculateShift, checkWin, BoardTree, evaluateMovesOnBoardTree } from './util.js';

import fs from 'fs';

import path from 'node:path';
const ROOTGAMEDIR = path.join(import.meta.dirname, 'state', 'games');

function flattenBoardTree(tree, layer, coordinates = '', flatBoard = {}) {
  coordinates += tree.row.toString()
  coordinates += tree.column.toString()
  if (layer === 0) {
    let obj = {}
    obj[coordinates] = tree
    console.log(obj)
    return obj
  }
  let obj = {}
  for (let row in tree.children) {
    for (let column in tree.children[row]) {
      obj = { ...obj, ...flattenBoardTree(tree.children[row][column], layer - 1, coordinates)}
    }
  }
  return obj 
}

export function getAvailableMoves(board, moves) {
    if (board.depth === 0 && board.wonBy === '') {
        moves.push(board.parent.getFullRoute([board.row, board.column]))
    }
    else {
        for (let row in board.children) {
            for (let column in board.children[row]) {
                if (board.children[row][column].isActive) {
                    getAvailableMoves(board.children[row][column], moves)
                }
            }
        }
    }
}

export class Game {
    #error;
    #maxDepth;
    constructor(gameID, gameDimension=1) {
        this.moves = [];
        this.gameID = gameID;
        this.playerX = '';
        this.playerO = '';
        this.gameStarted = false;
        this.gameDimension = gameDimension;
        this.playerWhoRequestedUndo = '';
        this.#error = false;
        this.#maxDepth = 6;
        //this.board = new BoardTree(null,gameDimension,0,0);
    }
    load() {
        const pathName = path.join(ROOTGAMEDIR, `${this.gameID}.json`);
        const content = fs.readFileSync(pathName)
        const cleanString = content.toString('utf8').replace(/^\uFEFF/, '');
        let game;
        try {
            game = JSON.parse(cleanString);
        }
        catch (err) {
            this.#error = true;
            console.log("load failed", err)
            return;
        }
        Object.assign(this, game);
        return game;
    };
    save() {
        fs.writeFileSync(path.join(ROOTGAMEDIR, `${this.gameID}.json`),JSON.stringify(this), (err) => {
            if (err) {
                this.#error = true;
                console.error("save failed", err);
            }
            else {
                console.log("move successful");
            }
        });
    }
    isError() {
        return this.#error;
    }
    checkMoveValidity(move) {
        const board = new BoardTree(null, this.gameDimension, 0, 0)
        console.log(this.moves.length)
        evaluateMovesOnBoardTree(this.moves.slice(0, this.moves.length-1), board, true)
        evaluateMovesOnBoardTree(this.moves, board)
        const targetBoard = getTreeNodeForCoords(board, move);
        // isactive only applies to boards of depth 1 or higher so wonby check is necessary
        if (targetBoard.parent.isActive && targetBoard.wonBy === '') {
            return true
        }
        return false
    }
    getPossibleResponses() {
        const board = new BoardTree(null, this.gameDimension, 0, 0)
        evaluateMovesOnBoardTree(this.moves.slice(0, this.moves.length-1), board, true)
        evaluateMovesOnBoardTree(this.moves, board)
        let potentialMoves = []
        getAvailableMoves(board, potentialMoves)
        return potentialMoves;
    }
    getScoreOf(board, depth = 0) {
        if (depth === this.#maxDepth) {
            //score
        }
        else {
            const possiblePlays = this.getPossibleResponses();
            for (i in possiblePlays) {
                //play this on the board -- idk how
                possiblePlays[i]
            }

        }
    }
}
