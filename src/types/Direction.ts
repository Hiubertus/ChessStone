import {ChessPiece} from "@/types/ChessPiece.ts";

export type Direction = {
    dx: number;
    dy: number;
};

export type PieceDirection = {
    dx: number;
    dy: number;
    pieces: ChessPiece['type'][];
};