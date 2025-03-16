import {Position} from "@/types/Position.ts";
import {BoardState} from "@/types/BoardState.ts";
import {Color} from "@/enums/Color.ts";
import {Piece} from "@/enums/Piece.ts";
import {clonePieces} from "@/utils/BoardUtilities/clonePieces.ts";
import {DIRECTION} from "@/constants/constants.ts";

export abstract class ChessPiece {
    public id: string;
    public hasMoved: boolean;

    constructor(
        public readonly color: Color,
        public position: Position,
        id?: string
    ) {
        this.hasMoved = false;
        this.id = id || `${color}_${this.getType()}_${Date.now()}`;
    }

    abstract getType(): Piece;

    abstract calculatePossibleMoves(
        board: (ChessPiece | null)[][],
        boardState: BoardState
    ): Position[];

    calculateLegalMoves(
        board: (ChessPiece | null)[][],
        boardState: BoardState
    ): Position[] {
        const possibleMoves = this.calculatePossibleMoves(board, boardState);
        const legalMoves: Position[] = [];

        for (const move of possibleMoves) {
            const newBoard = clonePieces(board);

            newBoard[move.y][move.x] = newBoard[this.position.y][this.position.x];
            newBoard[this.position.y][this.position.x] = null;

            let kingPos: Position;

            if (this.getType() === Piece.King) {
                kingPos = { x: move.x, y: move.y };
            } else {
                kingPos = this.findKing(newBoard, this.color);
            }

            if (!this.isPositionAttacked(kingPos.x, kingPos.y, newBoard, this.color)) {
                legalMoves.push(move);
            }
        }

        return legalMoves;
    }

    findKing(board: (ChessPiece | null)[][], color: Color): Position {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = board[y][x];
                if (piece && piece.getType() === Piece.King && piece.color === color) {
                    return { x, y };
                }
            }
        }

        throw new Error(`Król koloru ${color} nie został znaleziony na planszy`);
    }

    isPositionAttacked(
        x: number,
        y: number,
        board: (ChessPiece | null)[][],
        kingColor: Color
    ): boolean {
        const opponentColor = kingColor === Color.White ? Color.Black : Color.White;

        const pawnDirection = kingColor === Color.White ? 1 : -1;
        for (const dx of [-1, 1]) {
            const checkX = x + dx;
            const checkY = y + pawnDirection;

            if (this.isValidPosition(checkX, checkY)) {
                const piece = board[checkY][checkX];
                if (piece && piece.getType() === Piece.Pawn && piece.color === opponentColor) {
                    return true;
                }
            }
        }

        for (const move of DIRECTION.KNIGHT) {
            const checkX = x + move.dx;
            const checkY = y + move.dy;

            if (this.isValidPosition(checkX, checkY)) {
                const piece = board[checkY][checkX];
                if (piece && piece.getType() === Piece.Knight && piece.color === opponentColor) {
                    return true;
                }
            }
        }

        for (const dir of DIRECTION.ORTHOGONAL) {
            let checkX = x + dir.dx;
            let checkY = y + dir.dy;

            while (this.isValidPosition(checkX, checkY)) {
                const piece = board[checkY][checkX];

                if (piece) {
                    if (piece.color === opponentColor &&
                        (piece.getType() === Piece.Rook || piece.getType() === Piece.Queen)) {
                        return true;
                    }
                    break;
                }

                checkX += dir.dx;
                checkY += dir.dy;
            }
        }

        for (const dir of DIRECTION.DIAGONAL) {
            let checkX = x + dir.dx;
            let checkY = y + dir.dy;

            while (this.isValidPosition(checkX, checkY)) {
                const piece = board[checkY][checkX];

                if (piece) {
                    if (piece.color === opponentColor &&
                        (piece.getType() === Piece.Bishop || piece.getType() === Piece.Queen)) {
                        return true;
                    }
                    break;
                }

                checkX += dir.dx;
                checkY += dir.dy;
            }
        }

        for (const move of DIRECTION.KING) {
            const checkX = x + move.dx;
            const checkY = y + move.dy;

            if (this.isValidPosition(checkX, checkY)) {
                const piece = board[checkY][checkX];
                if (piece && piece.getType() === Piece.King && piece.color === opponentColor) {
                    return true;
                }
            }
        }

        return false;
    }

    moveTo(newPosition: Position): void {
        this.position = newPosition;
        this.hasMoved = true;
    }

    isSameColorPieceAt(
        x: number,
        y: number,
        board: (ChessPiece | null)[][]
    ): boolean {
        const piece = board[y][x];
        return piece !== null && piece.color === this.color;
    }

    isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
}