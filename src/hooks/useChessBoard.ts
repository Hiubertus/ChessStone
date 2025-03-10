import {BoardState} from "@/types/BoardState.ts";
import {useState} from "react";
import {ChessPiece} from "@/types/ChessPiece.ts";

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

export const initializeBoard = (): (ChessPiece | null)[][] => {
    // Tworzenie pustej szachownicy 8x8
    const board: (ChessPiece | null)[][] = Array(8).fill(null)
        .map(() => Array(8).fill(null));

    // Funkcja do generacji ID figury
    const generateId = (type: ChessPiece['type'], color: ChessPiece['color'], index: number) =>
        `${color}_${type}_${index}`;

    // Ustawienie figur na szachownicy
    // Czarne figury (górny rząd)
    board[0][0] = { id: generateId('rook', 'black', 1), type: 'rook', color: 'black' };
    board[0][1] = { id: generateId('knight', 'black', 1), type: 'knight', color: 'black' };
    board[0][2] = { id: generateId('bishop', 'black', 1), type: 'bishop', color: 'black' };
    board[0][3] = { id: generateId('queen', 'black', 1), type: 'queen', color: 'black' };
    board[0][4] = { id: generateId('king', 'black', 1), type: 'king', color: 'black' };
    board[0][5] = { id: generateId('bishop', 'black', 2), type: 'bishop', color: 'black' };
    board[0][6] = { id: generateId('knight', 'black', 2), type: 'knight', color: 'black' };
    board[0][7] = { id: generateId('rook', 'black', 2), type: 'rook', color: 'black' };

    // Czarne pionki
    for (let i = 0; i < 8; i++) {
        board[1][i] = { id: generateId('pawn', 'black', i + 1), type: 'pawn', color: 'black' };
    }

    // Białe pionki
    for (let i = 0; i < 8; i++) {
        board[6][i] = { id: generateId('pawn', 'white', i + 1), type: 'pawn', color: 'white' };
    }

    // Białe figury (dolny rząd)
    board[7][0] = { id: generateId('rook', 'white', 1), type: 'rook', color: 'white' };
    board[7][1] = { id: generateId('knight', 'white', 1), type: 'knight', color: 'white' };
    board[7][2] = { id: generateId('bishop', 'white', 1), type: 'bishop', color: 'white' };
    board[7][3] = { id: generateId('queen', 'white', 1), type: 'queen', color: 'white' };
    board[7][4] = { id: generateId('king', 'white', 1), type: 'king', color: 'white' };
    board[7][5] = { id: generateId('bishop', 'white', 2), type: 'bishop', color: 'white' };
    board[7][6] = { id: generateId('knight', 'white', 2), type: 'knight', color: 'white' };
    board[7][7] = { id: generateId('rook', 'white', 2), type: 'rook', color: 'white' };

    return board;
};