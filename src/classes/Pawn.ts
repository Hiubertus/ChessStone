import {ChessPiece} from "@/classes/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {Position} from "@/types/Position.ts";
import {Color} from "@/enums/Color.ts";
import {Piece} from "@/enums/Piece.ts";

export class Pawn extends ChessPiece {
    getType(): Piece {
        return Piece.Pawn;
    }

    calculatePossibleMoves(
        board: (ChessPiece | null)[][],
        boardState: BoardState
    ): Position[] {
        const possibleMoves: Position[] = [];
        const { x, y } = this.position;
        const direction = this.color === Color.White ? -1 : 1;

        if (this.isValidPosition(x, y + direction) && !board[y + direction][x]) {
            possibleMoves.push({ x, y: y + direction });

            if (!this.hasMoved &&
                this.isValidPosition(x, y + 2 * direction) &&
                !board[y + 2 * direction][x]) {
                possibleMoves.push({ x, y: y + 2 * direction });
            }
        }

        for (const dx of [-1, 1]) {
            const newX = x + dx;
            const newY = y + direction;

            if (this.isValidPosition(newX, newY)) {
                const targetPiece = board[newY][newX];
                if (targetPiece && targetPiece.color !== this.color) {
                    possibleMoves.push({ x: newX, y: newY });
                }
                else if (
                    !targetPiece &&
                    boardState.enPassantTarget &&
                    boardState.enPassantTarget.x === newX &&
                    boardState.enPassantTarget.y === newY
                ) {
                    possibleMoves.push({ x: newX, y: newY });
                }
            }
        }

        return possibleMoves;
    }

    canBePromoted(): boolean {
        const promotionRank = this.color === Color.White ? 0 : 7;
        return this.position.y === promotionRank;
    }
}