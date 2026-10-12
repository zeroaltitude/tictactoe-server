import { checkWin } from "./util.js";
import { PLAYERS } from "./constants.js";
import { getAvailableMoves } from "./movevalidation.js";
import _ from "lodash";
import { evaluateMoveOnBoardTree } from "./util.js";
import { DEBUGMODE } from "./constants.js";


const CHILDCOUNT = 3;
const THINKINGDURATION = 5; // in seconds

class MonteCarloTree {
    constructor(player, parent = null, move = null, depth = 0) {
        this.player = player;
        this.winCount = 0;
        this.simulationCount = 0;
        this.depth = depth; // not actually necessary to code, purely for debugging (FOR NOW!)
        this.move = move;
        this.children = [];
        this.parent = parent;
        this.isDead = false;
    }
}

function leafWalk(node, board) {
    if (node.children.length === 0) {
        return node
    }
    else {
        //probably works :
        //update: doesnt (node indexes dont align with scores if some scores are not taken)
        //this might be a good optimization though so fix later maybe
        //const nodeScores = node.children.reduce((scores, child) => {
        //    if (child.isDead) {
        //        console.log("THIS IS WHERE IT GETS GOOD")
        //    }
        //    if (!child.isDead) {
        //        scores.push(child.simulationCount === 0 ? Infinity : ((child.winCount / child.simulationCount) + (Math.sqrt(Math.log(node.simulationCount) / child.simulationCount))));
        //    }
        //    return scores
        //}, []);

        // semi inefficient implementation where dead scores are just -1 so they are not chosen
        const nodeScores = node.children.map((child) => {return (child.simulationCount === 0 ? Infinity : ((child.winCount / child.simulationCount) + (Math.sqrt(Math.log(node.simulationCount) / child.simulationCount))))})
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
        //POTENTIAL FOR OPTIMIZATION:
        //server query to true unless 1 move away from reaching leaf
        evaluateMoveOnBoardTree(chosenNode.player, chosenNode.move, board);
        return leafWalk(chosenNode, board);
    }
}

function selectAndExpand(rootNode, rootBoard) {
    const leaf = leafWalk(rootNode, rootBoard);
    if (leaf.isDead) {
        return leaf;
    }
    const nextPlayer = leaf.player === 'O' ? 'X' : 'O';
    const possibleMoves = getAvailableMoves(rootBoard);
    //const chosenMoves = possibleMoves.slice(0, CHILDCOUNT)
    // if draw happens
    if (possibleMoves.length === 0 || rootBoard.wonBy !== '') {
        //leaf.isDead = true;
        return leaf//.parent.children[Math.floor(leaf.parent.children.length * Math.random())];
    }
    for (const possibleMove of possibleMoves) {
        leaf.children.push(new MonteCarloTree(nextPlayer, leaf, possibleMove, leaf.depth + 1))
    }
    const chosenMoveIndex = Math.floor(possibleMoves.length * Math.random());
    evaluateMoveOnBoardTree(nextPlayer, possibleMoves[chosenMoveIndex], rootBoard);
    return leaf.children[chosenMoveIndex];
}

const _LASTSIMULATE = [];

function simulate(currentPlayer, board) {
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
        _LASTSIMULATE.push(chosenMove)
        evaluateMoveOnBoardTree(currentPlayer, chosenMove, board);
        return simulate(currentPlayer === 'X' ? 'O' : 'X', board);
    }
}

function backpropagate(leafNode, winIncrement, simulatedWinner) {
    leafNode.winCount += winIncrement;
    leafNode.simulationCount += 1;
    if (leafNode.parent === null) {
        return
    }
    else {
        backpropagate(leafNode.parent, winIncrement === null ? null : winIncrement === 0.5 ? 0.5 : leafNode.player === simulatedWinner ? 0 : 1, simulatedWinner)
    }
}

function executeRound(rootNode, board) {
    const rootBoard = _.cloneDeep(board);
    const leaf = selectAndExpand(rootNode, rootBoard);
    if (!leaf.isDead && (rootBoard.wonBy !== '' || getAvailableMoves(rootBoard).length === 0)) {
        if (leaf.simulationCount !== 0) {
            console.log("sssss")
        }
        leaf.isDead = true;
    }
    let simulatedWinner = leaf.isDead ? rootBoard.wonBy === "" ? '-' : rootBoard.wonBy : simulate(leaf.player, rootBoard);
    //const simulatedWinner = leaf.isDead ? rootBoard.wonBy === '' ? '-' : rootBoard.wonBy : simulate(leaf.player, rootBoard);
    backpropagate(leaf, simulatedWinner === '-' ? 0.5 : leaf.player === simulatedWinner ? 1 : 0, simulatedWinner)
    _LASTSIMULATE.length = 0
}

function simulateGames(board, currentPlayer) {
    const rootNode = new MonteCarloTree(currentPlayer === 'X' ? 'O' : 'X');
    const startTime = Math.floor(Date.now() / 1000)
    let roundNum = 0;
    while (true) {
        if (Math.floor(Date.now() / 1000) - startTime > THINKINGDURATION) {
            break;
        }
        //every path is exhausted
        if (rootNode.isDead) {
            break;
        }
        if (DEBUGMODE && roundNum % 1000 === 0) {
            console.log("round: " + roundNum);
        }
        roundNum++;
        executeRound(rootNode, board);
    }
    if (DEBUGMODE) {
        console.log(rootNode)
    }
    const scores = {};
    rootNode.children.map((childNode) => { scores[childNode.move] = childNode.winCount / childNode.simulationCount });
    console.log(scores)
    return scores;
}

export function getNextMove(board, currentPlayer) {
    const moveScores = simulateGames(board, currentPlayer)
    return Object.keys(moveScores).reduce((a, b) => moveScores[a] > moveScores[b] ? a : b);
}

