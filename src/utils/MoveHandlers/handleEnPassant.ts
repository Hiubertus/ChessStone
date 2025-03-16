import {Position} from "@/types/Position.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {Color} from "@/enums/Color.ts";

export const handleEnPassant = (
    pieces: (ChessPiece | null)[][],
    fromX: number,
    toX: number,
    toY: number,
    color: Color,
    enPassantTarget: Position | null
): { pieces: (ChessPiece | null)[][], isEnPassant: boolean } => {
    // Check if this is a potential en passant capture
    if (toX !== fromX && !pieces[toY][toX] && enPassantTarget) {
        // Check if the move is to the en passant target square
        const isEnPassant = enPassantTarget.x === toX && enPassantTarget.y === toY;

        if (isEnPassant) {
            // Remove the captured pawn
            const capturedPawnY = color === Color.White ? toY + 1 : toY - 1;
            pieces[capturedPawnY][toX] = null;
            return { pieces, isEnPassant: true };
        }
    }

    return { pieces, isEnPassant: false };
}