import {Direction, PieceDirection} from "@/types/Direction.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";

export const DIRECTION = {
    // Vertical and horizontal directions (rook, queen)
    ORTHOGONAL: [
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 }
    ] as Direction[],

    // Diagonal directions (bishop, queen)
    DIAGONAL: [
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 }
    ] as Direction[],

    // Knight movement pattern
    KNIGHT: [
        { dx: 1, dy: 2 }, { dx: 2, dy: 1 },
        { dx: -1, dy: 2 }, { dx: -2, dy: 1 },
        { dx: 1, dy: -2 }, { dx: 2, dy: -1 },
        { dx: -1, dy: -2 }, { dx: -2, dy: -1 }
    ] as Direction[],

    // King movement (all 8 surrounding tiles)
    KING: [
        { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
        { dx: -1, dy: 0 },                      { dx: 1, dy: 0 },
        { dx: -1, dy: 1 },  { dx: 0, dy: 1 },  { dx: 1, dy: 1 }
    ] as Direction[]
};

export const CHECK_DIRECTIONS: PieceDirection[] = [
    // Vertical and horizontal (rook, queen)
    { dx: 0, dy: 1, pieces: ['rook', 'queen'] },
    { dx: 0, dy: -1, pieces: ['rook', 'queen'] },
    { dx: 1, dy: 0, pieces: ['rook', 'queen'] },
    { dx: -1, dy: 0, pieces: ['rook', 'queen'] },

    // Diagonal (bishop, queen)
    { dx: 1, dy: 1, pieces: ['bishop', 'queen'] },
    { dx: 1, dy: -1, pieces: ['bishop', 'queen'] },
    { dx: -1, dy: 1, pieces: ['bishop', 'queen'] },
    { dx: -1, dy: -1, pieces: ['bishop', 'queen'] }
];

// Starting positions for pieces on the board
export const INITIAL_POSITIONS = {
    // Piece types from left to right
    BACK_ROW: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'] as ChessPiece['type'][]
};