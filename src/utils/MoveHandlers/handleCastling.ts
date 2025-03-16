import {Piece} from "@/enums/Piece.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {Color} from "@/enums/Color.ts";

export const handleCastling = (
    pieces: (ChessPiece | null)[][],
    fromX: number,
    toX: number,
    color: Color
): (ChessPiece | null)[][] => {
    const backRank = color === Color.White ? 7 : 0;

    if (toX !== 2 && toX !== 6) return pieces;

    const rookIndices: number[] = [];
    for (let x = 0; x < 8; x++) {
        const piece = pieces[backRank][x];
        if (piece && piece.type === Piece.Rook &&
            piece.color === color && !piece.hasMoved) {
            rookIndices.push(x);
        }
    }

    if (toX === 6) {
        const kingsideRooks = rookIndices.filter(x => x > fromX);
        if (kingsideRooks.length > 0) {
            const closestRookX = kingsideRooks.reduce((closest, current) =>
                current < closest ? current : closest, 7);

            // Move the rook to f1/f8 (5)
            const rookPiece = pieces[backRank][closestRookX];
            pieces[backRank][5] = rookPiece;
            pieces[backRank][closestRookX] = null;
            if (rookPiece) rookPiece.hasMoved = true;
        }
    }
    else if (toX === 2) {
        const queensideRooks = rookIndices.filter(x => x < fromX);
        if (queensideRooks.length > 0) {
            const closestRookX = queensideRooks.reduce((closest, current) =>
                current > closest ? current : closest, 0);

            const rookPiece = pieces[backRank][closestRookX];
            pieces[backRank][3] = rookPiece;
            pieces[backRank][closestRookX] = null;
            if (rookPiece) rookPiece.hasMoved = true;
        }
    }

    return pieces;
}