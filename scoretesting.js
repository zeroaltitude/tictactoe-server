import { BoardTree } from "./util.js";
import { getNextMove } from "./montecarlotreesearch.js";

const D2BOARD = {
    depth : 2,
    row : 0, 
    column : 0,
    wonBy : '',
    isActive : true,
    numOfMovesPlayed : 0,
    children :[
        [
            {
            depth : 1,
            row : 0, 
            column : 0,
            wonBy : '',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : 'X',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : 'X',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : 'X',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : 'X',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            },
            {
            depth : 1,
            row : 0, 
            column : 1,
            wonBy : '',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            },
            {
            depth : 1,
            row : 0, 
            column : 2,
            wonBy : 'O',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            }
        ],
        [
            {
            depth : 1,
            row : 1, 
            column : 0,
            wonBy : '',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            },
            {
            depth : 1,
            row : 1, 
            column : 1,
            wonBy : '',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            },
            {
            depth : 1,
            row : 1, 
            column : 2,
            wonBy : '',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            }
        ],
        [
            {
            depth : 1,
            row : 2, 
            column : 0,
            wonBy : '',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            },
            {
            depth : 1,
            row : 2, 
            column : 1,
            wonBy : '',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            },
            {
            depth : 1,
            row : 2, 
            column : 2,
            wonBy : 'O',
            isActive : true,
            numOfMovesPlayed : 0,
            children :[
                [
                    {
                        depth : 0,
                        row : 0, 
                        column : 0,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 1,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 0, 
                        column : 2,
                        wonBy : 'O',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 1, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 1, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ],
                [
                    {
                        depth : 0,
                        row : 2, 
                        column : 0,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 1,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    },
                    {
                        depth : 0,
                        row : 2, 
                        column : 2,
                        wonBy : '',
                        isActive : true,
                        numOfMovesPlayed : 0,
                        children : 0
                    }
                ]
            ]
            }
        ]
    ]
}

function objectToBoard(boardObj, parentBoard = null) {
    const boardTree = new BoardTree(null, boardObj.depth, 0, 0);
    Object.assign(boardTree, boardObj)
    if (boardObj.wonBy !== '') {
        boardTree.isActive = false;
    }
    boardTree.children = [];
    boardTree.parent = parentBoard;
    for (let row = 0; row < 3; row++) {
        boardTree.children[row] = [];
        for (let column = 0; column < 3; column++) {
            if (boardObj.depth > 1) {
                boardTree.children[row][column] = objectToBoard(boardObj.children[row][column], boardTree);
            }
            else {
                const leafTree = new BoardTree(parentBoard, 0, row, column);
                boardTree.children[row][column] = leafTree;
                leafTree.parent = boardTree;
                boardTree.children[row][column].wonBy = boardObj.children[row][column].wonBy;
                if (boardObj.children[row][column].wonBy !== '') {
                    leafTree.isActive = false;
                }
                if (!boardTree.isActive) {
                    leafTree.isActive = false;
                }
            }
        }
    }
    return boardTree
}

function main() {
    console.log(D2BOARD)
    console.log(objectToBoard(D2BOARD))
    //console.log(scorePossibleWins(D2BOARD))
    const recommendedMoveList = [];
    for (let i = 0; i < 10; i++) {
        const recommendedMove = getNextMove(objectToBoard(D2BOARD), 'O')
        recommendedMoveList.push(recommendedMove)
        console.log(recommendedMove)
    }
    console.log(recommendedMoveList);
} 

main()