import {ChessPiece} from "@/types/ChessPiece.ts";
import {getMovesInDirection} from "@/utils/BoardUtilities/getMovesInDirection.ts";
import {DIRECTION} from "@/constants/constants.ts";

export const calculateRookMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: 'white' | 'black'
): { x: number, y: number }[] => {
    return getMovesInDirection(x, y, DIRECTION.ORTHOGONAL, pieces, color);
};