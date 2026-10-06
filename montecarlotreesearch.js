import { checkWin } from "./util.js";
import { PLAYERS } from "./constants.js";
import { getAvailableMoves } from "./movevalidation.js";
import _ from "lodash";
import { evaluateMoveOnBoardTree } from "./util.js";

const CHILDCOUNT = 3;
const THINKINGDURATION = 5; // in seconds

class MonteCarloTree {
    constructor(player, parent = null, move = null, winCount = 0, simulationCount = 0) {
        this.player = player;
        this.winCount = winCount;
        this.simulationCount = simulationCount;
        this.parent = parent;
        this.children = [];
        this.move = move;
    }
}

function leafWalk(node, board) {
    if (node.children.length === 0) {
        return node
    }
    else {
        //server query to true unless 1 move away from reaching leaf
        const chosenNode = node.children[Math.floor(node.children.length * Math.random())]
        evaluateMoveOnBoardTree(chosenNode.move, board);
        return leafWalk(chosenNode, board);
    }
}

function selectAndExpand(rootNode, rootBoard) {
    const leaf = leafWalk(rootNode, rootBoard);
    const possibleMoves = _.shuffle(getAvailableMoves(rootBoard));
    const chosenMoves = possibleMoves.slice(0, CHILDCOUNT)
    for (const chosenMove of chosenMoves) {
        leaf.children.push(new MonteCarloTree(rootNode.player, leaf, chosenMove))
    }
    return leaf.children[Math.floor(chosenMoves.length * Math.random())]
}

function simulate(board) {
    if (board.wonBy !== '') {
        return board.wonBy
    }
    else {
        const possibleMoves = getAvailableMoves(board);
        // if draw happens
        if (possibleMoves.length === 0) {
            return '-';
        }
        const chosenMove = possibleMoves[Math.floor(possibleMoves.length * Math.random())];
        evaluateMoveOnBoardTree(chosenMove, board);
        return simulate(board);
    }
}

function backpropagate(leafNode, winIncrement) {
    leafNode.winCount += winIncrement;
    leafNode.simulationCount += 1;
    if (leafNode.parent === null) {
        return
    }
    else {
        backpropagate(leafNode.parent, winIncrement === 0.5 ? 0.5 : winIncrement === 0 ? 1 : 0)
    }
}

function executeRound(rootNode, board, currentPlayer) {
    const rootBoard = _.cloneDeep(board);
    const leaf = selectAndExpand(rootNode, rootBoard);
    const simulatedWinner = simulate(rootBoard);
    backpropagate(leaf, simulatedWinner === '-' ? 0.5 : simulatedWinner === currentPlayer ? 1 : 0)
}

function simulateGames(board, currentPlayer) {
    const rootNode = new MonteCarloTree(currentPlayer);
    const startTime = Math.floor(Date.now() / 1000)
    //let roundNum = 0;
    while (true) {
        if (Math.floor(Date.now() / 1000) - startTime > THINKINGDURATION) {
            break;
        }
        //console.log("round: " + roundNum)
        executeRound(rootNode, board, currentPlayer);
        //roundNum++;
    }
    const scores = {};
    rootNode.children.map((childNode) => { scores[childNode.move] = childNode.winCount / childNode.simulationCount });
    return scores;
}

export function getNextMove(board, currentPlayer) {
    const moveScores = simulateGames(board, currentPlayer)
    return Object.keys(moveScores).reduce((a, b) => moveScores[a] > moveScores[b] ? a : b);
}

