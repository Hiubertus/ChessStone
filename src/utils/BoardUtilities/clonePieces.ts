import {ChessPiece} from "@/types/ChessPiece.ts";

export const clonePieces = (pieces: (ChessPiece | null)[][]): (ChessPiece | null)[][] => {
    return pieces.map(row => [...row]);
};
