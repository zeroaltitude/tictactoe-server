import { getTreeNodeForCoords, calculateShift, checkWin, BoardTree, evaluateMovesOnBoardTree } from './util.js';

import fs from 'fs';

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

export class Game {
    #error;
    constructor(gameID, gameDimension=1) {
        this.moves = [];
        this.gameID = gameID;
        this.playerX = '';
        this.playerO = '';
        this.gameStarted = false;
        this.gameDimension = gameDimension;
        this.playerWhoRequestedUndo = '';
        this.#error = false;
        //this.board = new BoardTree(null,gameDimension,0,0);
    }
    load() {
        const game = JSON.parse(fs.readFileSync(`state/games/${this.gameID}.json`, (err, data) => {
            if (err) {
                this.#error = true
                console.error("load failed", err)
            }
        }));
        Object.assign(this, game);
        return game;
    };
    save() {
        fs.writeFileSync(`state/games/${this.gameID}.json`,JSON.stringify(this), (err) => {
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
        console.log("KLOOOKKSK")
        console.log(getTreeNodeForCoords(board, move))
        const targetBoard = getTreeNodeForCoords(board, move);
        // isactive only applies to boards of depth 1 or higher so wonby check is necessary
        if (targetBoard.parent.isActive && targetBoard.wonBy === '') {
            return true
        }
        return false
    }
}
