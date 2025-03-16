import {getMovesInDirection} from "@/utils/BoardUtilities/getMovesInDirection.ts";
import {DIRECTION} from "@/constants/constants.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {Color} from "@/enums/Color.ts";

export const calculateBishopMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: Color
): { x: number, y: number }[] => {
    return getMovesInDirection(x, y, DIRECTION.DIAGONAL, pieces, color);
};