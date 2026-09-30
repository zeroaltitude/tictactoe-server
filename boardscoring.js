import { checkWin } from "./util.js";
import { PLAYERS } from "./constants.js";
import { getAvailableMoves } from "./movevalidation.js";
import _ from "lodash";
import { evaluateMoveOnBoardTree } from "./util.js";

//scoring weights:
const PLYDEPTH = 3;
const DEPTHWEIGHT = 9;



function howManyWins(board) {
    let wins = 0;
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            const spot = board.children[row][column];
            for (const currentPlayer of PLAYERS) {
                if (spot.wonBy === '') {
                    spot.wonBy = currentPlayer;
                }
                else {
                    continue;
                }
                if (checkWin(board)) {
                    wins += ((currentPlayer === 'X') ? 1 : -1);
                }
                spot.wonBy = '';
            }
        }
    }
    return wins;
}

export function scorePossibleWins(board) {
    // if the current player plays, do they win? | score win count weighted by depth
    let score = 0;
    if (board.wonBy !== '') {
        return 0;
    }
    if (board.depth === 1) {
        return howManyWins(board);
    }
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            score += scorePossibleWins(board.children[row][column]);
        }
    }
    score += howManyWins(board) * Math.pow(DEPTHWEIGHT, board.depth - 1);
    return score;
}

const scoringFunctions = [scorePossibleWins];

function scoreBoard(board) {
    //let isMyTurn = board.numOfMovesPlayed % 2 === 1;
    let score = 0;
    for (const scoringFunction of scoringFunctions) {
        score += scoringFunction(board)
    }
    return score;
}

let tote = 0;

function scorePaths(playingBoard, currentPlayer, alpha = Math.inf, beta = -Math.inf, depth = 0) {
    // get list of possible moves on board for current player, breadth first search through possible moves, run score function for each
    // prune paths
    const possibleMoves = getAvailableMoves(playingBoard);
    tote++;
    if (tote % 1000 === 0) {
        console.log(tote)
    }
    const resultingScores = {};
    //console.log(`${possibleMoves.length}, ${depth}`)
    for (const move of possibleMoves) {
        const boardClone = _.cloneDeep(playingBoard);
        evaluateMoveOnBoardTree(move, boardClone);
        const boardScore = scoreBoard(boardClone);
        // here is where we would prune
        //
        if (PLYDEPTH > depth) {
            const moveScores = scorePaths(boardClone, currentPlayer, alpha, beta, depth + 1);
            resultingScores[move] = Object.keys(moveScores).reduce((a, b) => moveScores[a] > moveScores[b] ? a : b);
        } 
        else {
            resultingScores[move] = boardScore;
        }
    }
    return resultingScores
}

export function getNextMove(board, currentPlayer) {
    const moveScores = scorePaths(board, currentPlayer)
    return Object.keys(moveScores).reduce((a, b) => moveScores[a] > moveScores[b] ? a : b);
}