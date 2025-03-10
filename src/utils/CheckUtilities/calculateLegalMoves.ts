import {calculatePossibleMoves} from "@/utils/MoveUtilities/calcualtePossibleMoves.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {clonePieces} from "@/utils/BoardUtilities/clonePieces.ts";
import {isKingInCheck} from "@/utils/CheckUtilities/isKingInCheck.ts";

export const calculateLegalMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    boardState: BoardState
): { x: number, y: number }[] => {
    const piece = pieces[y][x];
    if (!piece) return [];

    const { kings } = boardState;
    const possibleMoves = calculatePossibleMoves(x, y, pieces, boardState);
    const legalMoves: { x: number, y: number }[] = [];

    // For each possible move, check if it would leave king in check
    for (const move of possibleMoves) {
        // Make a copy of the board and simulate the move
        const newPieces = clonePieces(pieces);
        newPieces[move.y][move.x] = newPieces[y][x];
        newPieces[y][x] = null;

        // Determine king position (it could be the moving piece)
        const kingPos = piece.type === 'king'
            ? { x: move.x, y: move.y }
            : kings[piece.color];

        // Check if king is safe after the move
        if (!isKingInCheck(kingPos.x, kingPos.y, piece.color, newPieces)) {
            legalMoves.push(move);
        }
    }

    return legalMoves;
};