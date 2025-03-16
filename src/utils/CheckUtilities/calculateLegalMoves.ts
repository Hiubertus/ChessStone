import {calculatePossibleMoves} from "@/utils/MoveUtilities/calcualtePossibleMoves.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {clonePieces} from "@/utils/BoardUtilities/clonePieces.ts";
import {isKingInCheck} from "@/utils/CheckUtilities/isKingInCheck.ts";
import {Piece} from "@/enums/Piece.ts";
import {Position} from "@/types/Position.ts";

export const calculateLegalMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    boardState: BoardState
): Position[] => {
    const piece = pieces[y][x];
    if (!piece) return [];

    const { kings } = boardState;
    const possibleMoves: Position[] = calculatePossibleMoves(x, y, pieces, boardState);
    const legalMoves: Position[] = [];

    for (const move of possibleMoves) {
        const newPieces = clonePieces(pieces);
        newPieces[move.y][move.x] = newPieces[y][x];
        newPieces[y][x] = null;

        const kingPos = piece.type === Piece.King
            ? { x: move.x, y: move.y }
            : kings[piece.color];

        if (!isKingInCheck(kingPos.x, kingPos.y, piece.color, newPieces)) {
            legalMoves.push(move);
        }
    }

    return legalMoves;
};