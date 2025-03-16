import {ChessPiece} from "@/types/ChessPiece.ts";
import {Color} from "@/enums/Color.ts";
import {Piece} from "@/enums/Piece.ts";

export const shouldPromotePawn = (piece: ChessPiece, toY: number): boolean => {
    return piece.type === Piece.Pawn &&
        ((piece.color === Color.White && toY === 0) ||
            (piece.color === Color.Black && toY === 7));
};
