import {ChessPiece} from "@/classes/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {Position} from "@/types/Position.ts";
import {Piece} from "@/enums/Piece.ts";
import {DIRECTION} from "@/constants/constants.ts";

export class King extends ChessPiece {
    getType(): Piece {
        return Piece.King;
    }

    calculatePossibleMoves(
        board: (ChessPiece | null)[][],
        boardState: BoardState
    ): Position[] {
        const possibleMoves: Position[] = [];
        const { x, y } = this.position;

        for (const move of DIRECTION.KING) {
            const newX = x + move.dx;
            const newY = y + move.dy;

            if (this.isValidPosition(newX, newY) && !this.isSameColorPieceAt(newX, newY, board)) {
                if (!this.isPositionAttacked(newX, newY, board, this.color)) {
                    possibleMoves.push({ x: newX, y: newY });
                }
            }
        }

        if (!this.hasMoved && !boardState.check) {
            if (!this.isPositionAttacked(x, y, board, this.color)) {
                const kingsideCastlingMove = this.getCastlingMove(board, true);
                if (kingsideCastlingMove) {
                    possibleMoves.push(kingsideCastlingMove);
                }

                const queensideCastlingMove = this.getCastlingMove(board, false);
                if (queensideCastlingMove) {
                    possibleMoves.push(queensideCastlingMove);
                }
            }
        }

        return possibleMoves;
    }

    getCastlingMove(board: (ChessPiece | null)[][], isKingside: boolean): Position | null {
        const { x, y } = this.position;

        const direction = isKingside ? 1 : -1;

        let rookX = -1;
        let rookFound = false;

        for (let checkX = x + direction; this.isValidPosition(checkX, y); checkX += direction) {
            const piece = board[y][checkX];

            if (piece && piece.getType() !== Piece.Rook) {
                break;
            }

            if (piece && piece.getType() === Piece.Rook &&
                piece.color === this.color && !piece.hasMoved) {
                rookX = checkX;
                rookFound = true;
                break;
            }
        }

        if (!rookFound) {
            return null;
        }

        const minX = Math.min(x, rookX);
        const maxX = Math.max(x, rookX);

        for (let checkX = minX + 1; checkX < maxX; checkX++) {
            if (board[y][checkX] !== null) {
                return null;
            }
        }

        const kingFinalX = x + (2 * direction);

        for (let checkX = x; Math.abs(checkX - x) <= 2; checkX += direction) {
            if (checkX === x) continue; // Skip checking the current king position (already checked)

            if (this.isPositionAttacked(checkX, y, board, this.color)) {
                return null;
            }

            if (checkX !== rookX && board[y][checkX] !== null) {
                return null;
            }

            if (checkX === kingFinalX) break;
        }

        return { x: kingFinalX, y };
    }

    isInCheck(board: (ChessPiece | null)[][]): boolean {
        return this.isPositionAttacked(this.position.x, this.position.y, board, this.color);
    }

    executeCastling(targetPosition: Position, board: (ChessPiece | null)[][]): void {
        const { x: kingStartX, y } = this.position;
        const { x: kingEndX } = targetPosition;

        const direction = kingEndX > kingStartX ? 1 : -1;

        let rookX = -1;
        let rookPiece: ChessPiece | null = null;

        for (let checkX = kingStartX + direction; this.isValidPosition(checkX, y); checkX += direction) {
            const piece = board[y][checkX];
            if (piece && piece.getType() === Piece.Rook && piece.color === this.color) {
                rookX = checkX;
                rookPiece = piece;
                break;
            }

            if (piece) {
                break;
            }
        }

        if (rookPiece) {
            const newRookX = kingEndX - direction;

            // Update rook position
            board[y][newRookX] = rookPiece;
            board[y][rookX] = null;
            rookPiece.moveTo({ x: newRookX, y });
        }
    }
}