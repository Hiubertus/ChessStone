import {Color} from "@/enums/Color.ts";
import {Piece} from "@/enums/Piece.ts";

export type ChessPiece = {
    id: string;
    type: Piece;
    color: Color
    hasMoved: boolean;
}

