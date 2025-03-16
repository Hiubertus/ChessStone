import {MoveHistory} from "@/types/MoveHistory.ts";
import {Position} from "@/types/Position.ts";
import {Piece} from "@/enums/Piece.ts";
import {Color} from "@/enums/Color.ts";

export const getEnPassantTarget = (moveHistory: MoveHistory[]): Position | null => {
    if (moveHistory.length === 0) return null;

    const lastMove = moveHistory[moveHistory.length - 1];
    const { piece, from, to } = lastMove;

    if (piece.type === Piece.Pawn && Math.abs(from.y - to.y) === 2) {
        const direction = piece.color === Color.White ? 1 : -1;
        return { x: to.x, y: to.y + direction };
    }

    return null;
};