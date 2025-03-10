import {isValidPosition} from "@/utils/BoardUtilities/isValidPosition.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {Direction} from "@/types/Direction.ts";

export const getMovesInDirection = (
    startX: number,
    startY: number,
    directions: Direction[],
    pieces: (ChessPiece | null)[][],
    pieceColor: 'white' | 'black'
): { x: number, y: number }[] => {
    const moves: { x: number, y: number }[] = [];

    for (const dir of directions) {
        let newX = startX + dir.dx;
        let newY = startY + dir.dy;

        while (isValidPosition(newX, newY)) {
            const targetPiece = pieces[newY][newX];

            if (!targetPiece) {
                // Empty square - add and continue
                moves.push({ x: newX, y: newY });
            } else {
                // Square has a piece
                if (targetPiece.color !== pieceColor) {
                    // Can capture opponent's piece
                    moves.push({ x: newX, y: newY });
                }
                // Stop in this direction after encountering any piece
                break;
            }

            newX += dir.dx;
            newY += dir.dy;
        }
    }

    return moves;
};