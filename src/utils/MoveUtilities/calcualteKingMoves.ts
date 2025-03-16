import {getFixedDistanceMoves} from "@/utils/BoardUtilities/getFixedDistanceMoves.ts";
import {DIRECTION} from "@/constants/constants.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {getCastlingMoves} from "@/utils/MoveUtilities/getCastlingMoves.ts";
import {Color} from "@/enums/Color.ts";
import {Position} from "@/types/Position.ts";

export const calculateKingMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: Color,
    boardState: BoardState
): { x: number, y: number }[] => {
    const normalMoves: Position[] = getFixedDistanceMoves(x, y, DIRECTION.KING, pieces, color);
    const castlingMoves: Position[] = getCastlingMoves(x, y, pieces, color, boardState);

    return [...normalMoves, ...castlingMoves];
};