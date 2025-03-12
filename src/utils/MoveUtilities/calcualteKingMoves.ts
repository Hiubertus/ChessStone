import {getFixedDistanceMoves} from "@/utils/BoardUtilities/getFixedDistanceMoves.ts";
import {DIRECTION} from "@/constants/constants.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {getCastlingMoves} from "@/utils/MoveUtilities/getCastlingMoves.ts";

export const calculateKingMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: 'white' | 'black',
    boardState: BoardState
): { x: number, y: number }[] => {
    const normalMoves = getFixedDistanceMoves(x, y, DIRECTION.KING, pieces, color);
    const castlingMoves = getCastlingMoves(x, y, pieces, color, boardState);

    return [...normalMoves, ...castlingMoves];
};