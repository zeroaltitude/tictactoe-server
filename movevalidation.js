import { getTreeNodeForCoords, calculateShift, checkWin, BoardTree, evaluateMovesOnBoardTree, evaluateMoveOnBoardTree } from './util.js';

import fs from 'fs';

import path from 'node:path';
const ROOTGAMEDIR = path.join(import.meta.dirname, 'state', 'games');

function flattenBoardTree(tree, layer, coordinates = '', flatBoard = {}) {
  coordinates += tree.row.toString()
  coordinates += tree.column.toString()
  if (layer === 0) {
    let obj = {}
    obj[coordinates] = tree
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

export function isDuplicateId(id) {
    const isUnique = fs.readdirSync('./state/games/').splice(1).every((file) => { return file.split('.')[0] !== id });
    return !isUnique;
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
        this.isComputerGame = false;
        this.gameHasEnded = false;
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
    getBoardFromStoredMoves() {
        const board = new BoardTree(null, this.gameDimension, 0, 0)
        const verifiedMoves = this.moves.slice(0, this.moves.length - 1);
        evaluateMovesOnBoardTree([], verifiedMoves, board, true)
        if (!(this.moves.length === 0)) {
            evaluateMoveOnBoardTree(this.moves.length % 2 === 0 ? 'O' : 'X', this.moves[this.moves.length - 1], board)
        }
        return board;
    }
    checkMoveValidity(move) {
        const targetBoard = getTreeNodeForCoords(this.getBoardFromStoredMoves(), move);
        // isactive only applies to boards of depth 1 or higher so wonby check is necessary
        if (targetBoard.parent.isActive && targetBoard.wonBy === '') {
            return true
        }
        return false
    }
}
