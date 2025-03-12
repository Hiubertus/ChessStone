import {Direction, PieceDirection} from "@/types/Direction.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";

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
    { dx: 0, dy: 1, pieces: ['rook', 'queen'] },
    { dx: 0, dy: -1, pieces: ['rook', 'queen'] },
    { dx: 1, dy: 0, pieces: ['rook', 'queen'] },
    { dx: -1, dy: 0, pieces: ['rook', 'queen'] },

    { dx: 1, dy: 1, pieces: ['bishop', 'queen'] },
    { dx: 1, dy: -1, pieces: ['bishop', 'queen'] },
    { dx: -1, dy: 1, pieces: ['bishop', 'queen'] },
    { dx: -1, dy: -1, pieces: ['bishop', 'queen'] }
];

export const CASTLING = {
    KING_SIDE: { kingMove: 2, rookMove: -1 },
    QUEEN_SIDE: { kingMove: -2, rookMove: 1 }
} as const;

export const INITIAL_POSITIONS = {
    BACK_ROW: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'] as ChessPiece['type'][]
};