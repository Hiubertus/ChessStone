import {Direction, PieceDirection} from "@/types/Direction.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {Piece} from "@/enums/Piece.ts";

export const DIRECTION = {
    ORTHOGONAL: [
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 }
    ] as Direction[],

    DIAGONAL: [
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 }
    ] as Direction[],

    KNIGHT: [
        { dx: 1, dy: 2 }, { dx: 2, dy: 1 },
        { dx: -1, dy: 2 }, { dx: -2, dy: 1 },
        { dx: 1, dy: -2 }, { dx: 2, dy: -1 },
        { dx: -1, dy: -2 }, { dx: -2, dy: -1 }
    ] as Direction[],

    KING: [
        { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
        { dx: -1, dy: 0 },                      { dx: 1, dy: 0 },
        { dx: -1, dy: 1 },  { dx: 0, dy: 1 },  { dx: 1, dy: 1 }
    ] as Direction[]
};

export const CHECK_DIRECTIONS: PieceDirection[] = [
    { dx: 0, dy: 1, pieces: [Piece.Rook, Piece.Queen] },
    { dx: 0, dy: -1, pieces: [Piece.Rook, Piece.Queen] },
    { dx: 1, dy: 0, pieces: [Piece.Rook, Piece.Queen] },
    { dx: -1, dy: 0, pieces: [Piece.Rook, Piece.Queen] },

    { dx: 1, dy: 1, pieces: [Piece.Rook, Piece.Queen] },
    { dx: 1, dy: -1, pieces: [Piece.Rook, Piece.Queen] },
    { dx: -1, dy: 1, pieces: [Piece.Rook, Piece.Queen] },
    { dx: -1, dy: -1, pieces: [Piece.Rook, Piece.Queen] }
];

export const BASE_INITIAL_POSITION = {
    BACK_ROW: [Piece.Rook, Piece.Knight , Piece.Bishop, Piece.Queen, Piece.King, Piece.Bishop, Piece.Knight, Piece.Rook] as ChessPiece['type'][]
};