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

// Function to create the initial chess board setup
export const initializeBoard = (): (ChessPiece | null)[][] => {
    // Create empty 8x8 board
    const board: (ChessPiece | null)[][] = Array(8).fill(null)
        .map(() => Array(8).fill(null));

    // Generate a unique ID for each piece
    const generateId = (type: ChessPiece['type'], color: ChessPiece['color'], index: number) =>
        `${color}_${type}_${index}`;

    // Set up back row pieces using the constants
    const backRow = INITIAL_POSITIONS.BACK_ROW;

    // Place black pieces (top row)
    for (let i = 0; i < 8; i++) {
        board[0][i] = {
            id: generateId(backRow[i], 'black', Math.floor(i/2) + 1),
            type: backRow[i],
            color: 'black'
        };
    }

    // Place black pawns
    for (let i = 0; i < 8; i++) {
        board[1][i] = {
            id: generateId('pawn', 'black', i + 1),
            type: 'pawn',
            color: 'black'
        };
    }

    // Place white pawns
    for (let i = 0; i < 8; i++) {
        board[6][i] = {
            id: generateId('pawn', 'white', i + 1),
            type: 'pawn',
            color: 'white'
        };
    }

    // Place white pieces (bottom row)
    for (let i = 0; i < 8; i++) {
        board[7][i] = {
            id: generateId(backRow[i], 'white', Math.floor(i/2) + 1),
            type: backRow[i],
            color: 'white'
        };
    }

    return board;
};