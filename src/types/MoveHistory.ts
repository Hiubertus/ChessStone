import {ChessPiece} from "@/types/ChessPiece.ts";
import {Position} from "@/types/Position.ts";

export type MoveHistory = {
    piece: ChessPiece;
    from: Position;
    to: Position;
}