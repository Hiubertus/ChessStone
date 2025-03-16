import {ChessPiece} from "@/types/ChessPiece.ts";
import {getMovesInDirection} from "@/utils/BoardUtilities/getMovesInDirection.ts";
import {DIRECTION} from "@/constants/constants.ts";
import {Color} from "@/enums/Color.ts";
import {Position} from "@/types/Position.ts";

export const calculateRookMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: Color
): Position[] => {
    return getMovesInDirection(x, y, DIRECTION.ORTHOGONAL, pieces, color);
};