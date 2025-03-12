import {BoardState} from "@/types/BoardState.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {calculatePawnMoves} from "@/utils/MoveUtilities/calculatePawnMoves.ts";
import {calculateKnightMoves} from "@/utils/MoveUtilities/calculateKnightMoves.ts";
import {calculateBishopMoves} from "@/utils/MoveUtilities/calculateBishopMoves.ts";
import {calculateRookMoves} from "@/utils/MoveUtilities/calculateRookMoves.ts";
import {calculateQueenMoves} from "@/utils/MoveUtilities/calculateQueenMoves.ts";
import {calculateKingMoves} from "@/utils/MoveUtilities/calcualteKingMoves.ts";

export const calculatePossibleMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    boardState: BoardState
): { x: number, y: number }[] => {
    const piece = pieces[y][x];
    if (!piece) return [];

    const { color, type } = piece;
    const { enPassantTarget } = boardState;

    switch (type) {
        case 'pawn':
            return calculatePawnMoves(x, y, pieces, color, enPassantTarget);
        case 'knight':
            return calculateKnightMoves(x, y, pieces, color);
        case 'bishop':
            return calculateBishopMoves(x, y, pieces, color);
        case 'rook':
            return calculateRookMoves(x, y, pieces, color);
        case 'queen':
            return calculateQueenMoves(x, y, pieces, color);
        case 'king':
            return calculateKingMoves(x, y, pieces, color, boardState);
        default:
            return [];
    }
};