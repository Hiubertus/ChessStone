import {ChessPiece} from "@/classes/ChessPiece.ts";
import {Position} from "@/types/Position.ts";
import {Piece} from "@/enums/Piece.ts";
import {DIRECTION} from "@/constants/constants.ts";

export class Knight extends ChessPiece {
    getType(): Piece {
        return Piece.Knight;
    }

    calculatePossibleMoves(
        board: (ChessPiece | null)[][],
    ): Position[] {
        const possibleMoves: Position[] = [];
        const { x, y } = this.position;

        for (const move of DIRECTION.KNIGHT) {
            const newX = x + move.dx;
            const newY = y + move.dy;

            if (this.isValidPosition(newX, newY) && !this.isSameColorPieceAt(newX, newY, board)) {
                possibleMoves.push({ x: newX, y: newY });
            }
        }

        return possibleMoves;
    }
}