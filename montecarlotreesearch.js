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
        const nodeScores = node.children.map((child) => { return child.simulationCount === 0 ? Infinity : ((child.winCount / child.simulationCount) + (Math.sqrt(Math.log(node.simulationCount) / child.simulationCount)))});
        let max = nodeScores[0];
        let indexOfMax = 0;
        for (let i = 1; i < nodeScores.length; i++) {
            if (nodeScores[i] > max) {
                indexOfMax = i;
                max = nodeScores[i];
            }
        }
        // make equal max scores random???? maybe???/
        const chosenNode = node.children[indexOfMax];
        evaluateMoveOnBoardTree(chosenNode.move, board);
        return leafWalk(chosenNode, board);
    }
}

function selectAndExpand(rootNode, rootBoard) {
    const leaf = leafWalk(rootNode, rootBoard);
    const nextPlayer = leaf.player === 'O' ? 'X' : 'O';
    const possibleMoves = getAvailableMoves(rootBoard);
    //const chosenMoves = possibleMoves.slice(0, CHILDCOUNT)
    // if draw happens
    if (possibleMoves.length === 0) {
        return leaf.parent.children[Math.floor(leaf.parent.children.length * Math.random())];
    }
    for (const possibleMove of possibleMoves) {
        leaf.children.push(new MonteCarloTree(nextPlayer, leaf, possibleMove))
    }
    return leaf.children[Math.floor(possibleMoves.length * Math.random())];
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

function backpropagate(leafNode, winIncrement, simulatedWinner) {
    leafNode.winCount += winIncrement;
    leafNode.simulationCount += 1;
    if (leafNode.parent === null) {
        return
    }
    else {
        backpropagate(leafNode.parent, winIncrement === 0.5 ? 0.5 : leafNode.player === simulatedWinner ? 1 : 0, simulatedWinner)
    }
}

function executeRound(rootNode, board, currentPlayer) {
    const rootBoard = _.cloneDeep(board);
    const leaf = selectAndExpand(rootNode, rootBoard);
    const simulatedWinner = simulate(rootBoard);
    backpropagate(leaf, simulatedWinner === '-' ? 0.5 : leaf.player === simulatedWinner ? 0 : 1, simulatedWinner)
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

