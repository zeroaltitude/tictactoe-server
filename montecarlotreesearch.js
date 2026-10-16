import _ from "lodash";
import { evaluateMoveOnBoardTree, getAvailableMoves } from "./util.js";
import { DEBUGMODE } from "./constants.js";


const THINKINGDURATION = .25; // in seconds

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
    // if node reached where game ends
    if (possibleMoves.length === 0 || rootBoard.wonBy !== '') {
        return leaf;
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
        backpropagate(leafNode.parent, winIncrement === 0.5 ? 0.5 : leafNode.player === simulatedWinner ? 0 : 1, simulatedWinner)
    }
}

function executeRound(rootNode, board) {
    const rootBoard = _.cloneDeep(board);
    const leaf = selectAndExpand(rootNode, rootBoard);
    if (!leaf.isDead && (rootBoard.wonBy !== '' || getAvailableMoves(rootBoard).length === 0)) {
        leaf.isDead = true;
    }
    let simulatedWinner = leaf.isDead ? rootBoard.wonBy === "" ? '-' : rootBoard.wonBy : simulate(leaf.player, rootBoard);
    backpropagate(leaf, simulatedWinner === '-' ? 0.5 : leaf.player === simulatedWinner ? 1 : 0, simulatedWinner)
    _LASTSIMULATE.length = 0
}

function simulateGames(board, currentPlayer) {
    const rootNode = new MonteCarloTree(currentPlayer === 'X' ? 'O' : 'X');
    const startTime = Math.floor(Date.now() / 1000)
    let roundNum = 0;
    while (true) {
        if (Math.floor(Date.now() / 1000) - startTime > THINKINGDURATION || roundNum > 5000 * Math.pow(9, board.depth-1)) { 
            break;
        }
        if (DEBUGMODE && roundNum % 1000 === 0) {
            console.log("round: " + roundNum);
        }
        roundNum++;
        executeRound(rootNode, board);
    }
    const scores = {};
    rootNode.children.map((childNode) => { scores[childNode.move] = childNode.winCount / childNode.simulationCount });
    return scores;
}

function applyDifficultyToMoveset(scores, difficulty) {
    const scoreIndex = scores.length - 1;
    const difficultyWeights = {
        "easy": [Math.floor(scoreIndex * .1), scoreIndex],
        "medium": [Math.floor(scoreIndex * .05), Math.floor(scores.length * .5)],
        "hard": [0, Math.min(3, scoreIndex)],
        "insane": [0, 1]
    };  
    const chosenPossibleMoves = scores.slice(difficultyWeights[difficulty][0], difficultyWeights[difficulty][1]);
    return chosenPossibleMoves[Math.floor(chosenPossibleMoves.length * Math.random())][0]
}

export function getNextMove(board, currentPlayer, botDifficulty) {
    const moveScores = simulateGames(board, currentPlayer)
    if (Object.keys(moveScores).length === 0) {
        return [];
    }
    const sortedScores = Object.entries(moveScores).sort((a, b) => b[1] - a[1]) //scores sorted descendingly in array format
    return applyDifficultyToMoveset(sortedScores, botDifficulty)

    //return Object.keys(moveScores).reduce((a, b) => moveScores[a] > moveScores[b] ? a : b, []); //returns move corresponding to highest score
}

