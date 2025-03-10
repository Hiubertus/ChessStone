import {isValidPosition} from "@/utils/BoardUtilities/isValidPosition.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";

export const calculatePawnMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: 'white' | 'black',
    enPassantTarget: { x: number, y: number } | null
): { x: number, y: number }[] => {
    const possibleMoves: { x: number, y: number }[] = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    // Forward movement
    if (isValidPosition(x, y + direction) && !pieces[y + direction][x]) {
        possibleMoves.push({ x, y: y + direction });

        // Double move from starting position
        if (y === startRow && !pieces[y + 2 * direction][x]) {
            possibleMoves.push({ x, y: y + 2 * direction });
        }
    }

    // Captures (diagonal)
    for (const dx of [-1, 1]) {
        const newX = x + dx;
        const newY = y + direction;

        if (isValidPosition(newX, newY)) {
            // Standard capture
            const targetPiece = pieces[newY][newX];
            if (targetPiece && targetPiece.color !== color) {
                possibleMoves.push({ x: newX, y: newY });
            }
            // En passant capture
            else if (
                !targetPiece &&
                enPassantTarget &&
                enPassantTarget.x === newX &&
                enPassantTarget.y === newY
            ) {
                possibleMoves.push({ x: newX, y: newY });
            }
        }
    }

    return possibleMoves;
};