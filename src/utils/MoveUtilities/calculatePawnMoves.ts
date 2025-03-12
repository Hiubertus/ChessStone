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
    const piece = pieces[y][x]!;

    if (isValidPosition(x, y + direction) && !pieces[y + direction][x]) {
        possibleMoves.push({ x, y: y + direction });

        if (!piece.hasMoved && isValidPosition(x, y + 2 * direction) && !pieces[y + 2 * direction][x]) {
            possibleMoves.push({ x, y: y + 2 * direction });
        }
    }

    for (const dx of [-1, 1]) {
        const newX = x + dx;
        const newY = y + direction;

        if (isValidPosition(newX, newY)) {
            const targetPiece = pieces[newY][newX];
            if (targetPiece && targetPiece.color !== color) {
                possibleMoves.push({ x: newX, y: newY });
            }
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