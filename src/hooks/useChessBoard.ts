import {useState} from "react";
import {BoardState} from "@/types/BoardState";
import {ChessPiece} from "@/types/ChessPiece";
import {INITIAL_POSITIONS} from "@/constants/constants.ts";
import {Color} from "@/enums/Color.ts";
import {Piece} from "@/enums/Piece.ts";

export const useChessBoard = () => {
    const initialPieces = initializeBoard();
    const initialState: BoardState = {
        pieces: initialPieces,
        selectedTile: null,
        possibleMoves: [],
        currentPlayer: Color.White,
        kings: {
            [Color.White]: { x: 4, y: 7 },
            [Color.Black]: { x: 4, y: 0 }
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
            id: generateId(backRow[i], Color.Black, Math.floor(i/2) + 1),
            type: backRow[i],
            color: Color.Black,
            hasMoved: false
        };
    }

    for (let i = 0; i < 8; i++) {
        board[1][i] = {
            id: generateId(Piece.Pawn, Color.Black, i + 1),
            type: Piece.Pawn,
            color: Color.Black,
            hasMoved: false
        };
    }

    for (let i = 0; i < 8; i++) {
        board[6][i] = {
            id: generateId(Piece.Pawn, Color.White, i + 1),
            type: Piece.Pawn,
            color: Color.White,
            hasMoved: false
        };
    }

    for (let i = 0; i < 8; i++) {
        board[7][i] = {
            id: generateId(backRow[i], Color.White, Math.floor(i/2) + 1),
            type: backRow[i],
            color: Color.White,
            hasMoved: false
        };
    }

    return board;
};