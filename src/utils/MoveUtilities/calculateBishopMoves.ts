import {getMovesInDirection} from "@/utils/BoardUtilities/getMovesInDirection.ts";
import {DIRECTION} from "@/constants/constants.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";

export const calculateBishopMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: 'white' | 'black'
): { x: number, y: number }[] => {
    return getMovesInDirection(x, y, DIRECTION.DIAGONAL, pieces, color);
};