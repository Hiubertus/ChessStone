import {Color} from "@/enums/Color.ts";
import {Piece} from "@/enums/Piece.ts";
import {Position} from "@/types/Position.ts";

export type ChessPiece = {
    id: string;
    type: Piece;
    color: Color;
    hasMoved: boolean;
    position: Position;
}

