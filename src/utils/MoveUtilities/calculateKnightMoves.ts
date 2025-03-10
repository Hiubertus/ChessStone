import {getFixedDistanceMoves} from "@/utils/BoardUtilities/getFixedDistanceMoves.ts";
import {DIRECTION} from "@/constants/constants.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";

export const calculateKnightMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: 'white' | 'black'
): { x: number, y: number }[] => {
    return getFixedDistanceMoves(x, y, DIRECTION.KNIGHT, pieces, color);
};