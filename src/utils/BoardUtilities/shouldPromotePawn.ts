import {ChessPiece} from "@/types/ChessPiece.ts";

export const shouldPromotePawn = (piece: ChessPiece, toY: number): boolean => {
    return piece.type === 'pawn' &&
        ((piece.color === 'white' && toY === 0) ||
            (piece.color === 'black' && toY === 7));
};
