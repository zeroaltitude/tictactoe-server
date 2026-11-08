import { getTreeNodeForCoords, BoardTree, evaluateMovesOnBoardTree, evaluateMoveOnBoardTree } from './util.js';
import _ from "lodash"
import fs from 'fs';

import path from 'node:path';
const ROOTGAMEDIR = path.join(import.meta.dirname, 'state', 'games');

export function boardToObject(board) {
  const obj = {
    depth: board.depth,
    row: board.row,
    column: board.column,
    wonBy: board.wonBy,
    isActive: board.isActive,
    children: board.depth === 0 ? 0 : []
  }
  if (board.children === 0) {
    return obj;
  }
  else {
    for (let row = 0; row < 3; row++) {
      const rowChildren = [];
      rowChildren.length = 0;
      for (let column = 0; column < 3; column++) {
        rowChildren.push(boardToObject(board.children[row][column]));
      }
      obj.children.push(rowChildren)
    }
    return obj;
  }
}

export function objectToBoard(boardObj, fixActiveStatus = false, parentBoard = null) {
    const boardTree = new BoardTree(null, boardObj.depth, 0, 0);
    Object.assign(boardTree, boardObj)
    boardTree.isActive = fixActiveStatus ? boardObj.wonBy === '' : boardObj.isActive
    boardTree.children = [];
    boardTree.parent = parentBoard;
    for (let row = 0; row < 3; row++) {
        boardTree.children[row] = [];
        for (let column = 0; column < 3; column++) {
            if (boardObj.depth > 1) {
                boardTree.children[row][column] = objectToBoard(boardObj.children[row][column], fixActiveStatus, boardTree);
            }
            else {
                const leafTree = new BoardTree(parentBoard, 0, row, column);
                boardTree.children[row][column] = leafTree;
                leafTree.parent = boardTree;
                boardTree.children[row][column].wonBy = boardObj.children[row][column].wonBy;
                leafTree.isActive = fixActiveStatus ? boardObj.children[row][column].wonBy === '' : boardObj.children[row][column].isActive;
                if (!boardTree.isActive && fixActiveStatus) {
                    leafTree.isActive = false;
                }
            }
        }
    }
    return boardTree
}

export function getBoardUsingMoves(gameDimension, moves) {
    const board = new BoardTree(null, gameDimension, 0, 0)
    const verifiedMoves = moves.slice(0, moves.length - 1);  
    evaluateMovesOnBoardTree([], verifiedMoves, board, true)
    if (!(moves.length === 0)) {
        evaluateMoveOnBoardTree(moves.length % 2 === 0 ? 'O' : 'X', moves[moves.length - 1], board)
    }
    return board;
}

export function isDuplicateId(id) {
    const isUnique = fs.readdirSync('./state/games/').splice(1).every((file) => { return file.split('.')[0] !== id });
    return !isUnique;
}

export class Game {
    #error;
    constructor(gameID, gameDimension = 1, undoEnabled = false) {
        this.#error = false;
        this.moves = [];
        this.gameID = gameID;
        this.playerX = '';
        this.playerO = '';
        this.gameStarted = false;
        this.gameDimension = gameDimension;
        this.playerWhoRequestedUndo = '';
        this.isComputerGame = false;
        this.gameHasEnded = false; 
        this.undoEnabled = undoEnabled;
        this.botDifficulty = null;
        const tempBoard = new BoardTree(null, gameDimension, 0, 0);
        this.boardObj = boardToObject(tempBoard);
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
    updateMoves(move, setMovesTo = []) {
        if (setMovesTo.length !== 0) {
            //console.log(setMovesTo)
            this.moves = setMovesTo;
            const newBoard = getBoardUsingMoves(this.gameDimension, this.moves);
            this.boardObj = boardToObject(newBoard);
        }
        else {
            this.moves.push(move);
            const board = objectToBoard(this.boardObj);
            evaluateMoveOnBoardTree(this.moves.length % 2 === 0 ? 'O' : 'X', move, board);
            this.boardObj = boardToObject(board);
        }
    }
    getBoard() {
        return objectToBoard(this.boardObj);
    }
    checkMoveValidity(move) {
        const targetBoard = getTreeNodeForCoords(this.getBoard(), move);
        // isactive only applies to boards of depth 1 or higher so wonby check is necessary
        if (targetBoard.parent.isActive && targetBoard.wonBy === '') {
            return true
        }
        return false
    }
}
