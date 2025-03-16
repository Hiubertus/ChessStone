import {ChessPiece} from "@/classes/ChessPiece.ts";
import {Position} from "@/types/Position.ts";
import {Piece} from "@/enums/Piece.ts";
import {DIRECTION} from "@/constants/constants.ts";

export class Bishop extends ChessPiece {
    getType(): Piece {
        return Piece.Bishop;
    }

    calculatePossibleMoves(
        board: (ChessPiece | null)[][],
    ): Position[] {
        const possibleMoves: Position[] = [];
        const { x, y } = this.position;

        for (const dir of DIRECTION.DIAGONAL) {
            let newX = x + dir.dx;
            let newY = y + dir.dy;

            while (this.isValidPosition(newX, newY)) {
                const piece = board[newY][newX];

                if (!piece) {
                    possibleMoves.push({ x: newX, y: newY });
                } else {
                    if (piece.color !== this.color) {
                        possibleMoves.push({ x: newX, y: newY });
                    }
                    break;
                }

                newX += dir.dx;
                newY += dir.dy;
            }
        }

        return possibleMoves;
    }
}