import { useState } from "react";
import { BoardState } from "@/types/BoardState";
import { ChessPiece } from "@/types/ChessPiece";
import { INITIAL_POSITIONS } from "@/constants/constants.ts";

export const useChessBoard = () => {
    const initialPieces = initializeBoard();
    const initialState: BoardState = {
        pieces: initialPieces,
        selectedTile: null,
        possibleMoves: [],
        currentPlayer: 'white',
        kings: {
            white: { x: 4, y: 7 },
            black: { x: 4, y: 0 }
        },
        check: null,
        checkmate: null,
        enPassantTarget: null,
        moveHistory: [],
        lastMove: {
            from: null,
            to: null
        },
        promotion: {
            active: false,
            position: null,
            color: null,
            pendingMove: null,
            tileRef: null
        }
    };

    const [boardState, setBoardState] = useState<BoardState>(initialState);

    return { boardState, setBoardState };
};

export const initializeBoard = (): (ChessPiece | null)[][] => {
    const board: (ChessPiece | null)[][] = Array(8).fill(null)
        .map(() => Array(8).fill(null));

    const generateId = (type: ChessPiece['type'], color: ChessPiece['color'], index: number) =>
        `${color}_${type}_${index}`;

    const backRow = INITIAL_POSITIONS.BACK_ROW;

    for (let i = 0; i < 8; i++) {
        board[0][i] = {
            id: generateId(backRow[i], 'black', Math.floor(i/2) + 1),
            type: backRow[i],
            color: 'black',
            hasMoved: false
        };
    }

    for (let i = 0; i < 8; i++) {
        board[1][i] = {
            id: generateId('pawn', 'black', i + 1),
            type: 'pawn',
            color: 'black',
            hasMoved: false
        };
    }

    for (let i = 0; i < 8; i++) {
        board[6][i] = {
            id: generateId('pawn', 'white', i + 1),
            type: 'pawn',
            color: 'white',
            hasMoved: false
        };
    }

    for (let i = 0; i < 8; i++) {
        board[7][i] = {
            id: generateId(backRow[i], 'white', Math.floor(i/2) + 1),
            type: backRow[i],
            color: 'white',
            hasMoved: false
        };
    }

    return board;
};