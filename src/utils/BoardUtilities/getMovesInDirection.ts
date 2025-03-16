import {isValidPosition} from "@/utils/BoardUtilities/isValidPosition.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {Direction} from "@/types/Direction.ts";
import {Color} from "@/enums/Color.ts";
import {Position} from "@/types/Position.ts";

export const getMovesInDirection = (
    startX: number,
    startY: number,
    directions: Direction[],
    pieces: (ChessPiece | null)[][],
    pieceColor: Color
): Position[] => {
    const moves: Position[] = [];

    for (const dir of directions) {
        let newX = startX + dir.dx;
        let newY = startY + dir.dy;

        while (isValidPosition(newX, newY)) {
            const targetPiece = pieces[newY][newX];

            if (!targetPiece) {
                moves.push({ x: newX, y: newY });
            } else {
                if (targetPiece.color !== pieceColor) {
                    moves.push({ x: newX, y: newY });
                }
                break;
            }

            newX += dir.dx;
            newY += dir.dy;
        }
    }

    return moves;
};