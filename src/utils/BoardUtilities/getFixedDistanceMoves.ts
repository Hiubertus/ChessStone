import {Direction} from "@/types/Direction.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {isValidPosition} from "@/utils/BoardUtilities/isValidPosition.ts";

export const getFixedDistanceMoves = (
    startX: number,
    startY: number,
    directions: Direction[],
    pieces: (ChessPiece | null)[][],
    pieceColor: 'white' | 'black'
): { x: number, y: number }[] => {
    const moves: { x: number, y: number }[] = [];

    for (const dir of directions) {
        const newX = startX + dir.dx;
        const newY = startY + dir.dy;

        if (isValidPosition(newX, newY)) {
            const targetPiece = pieces[newY][newX];
            if (!targetPiece || targetPiece.color !== pieceColor) {
                moves.push({ x: newX, y: newY });
            }
        }
    }

    return moves;
};