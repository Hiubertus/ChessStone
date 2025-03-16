import { isKingInCheck } from "@/utils/CheckUtilities/isKingInCheck.ts";
import { ChessPiece } from "@/types/ChessPiece.ts";
import { BoardState } from "@/types/BoardState.ts";
import { Color } from "@/enums/Color.ts";
import { Piece } from "@/enums/Piece.ts";
import { Position } from "@/types/Position.ts";

export const getCastlingMoves = (
    kingX: number,
    kingY: number,
    pieces: (ChessPiece | null)[][],
    color: Color,
    boardState: BoardState
): Position[] => {
    const castlingMoves: Position[] = [];
    const { check } = boardState;
    const king = pieces[kingY][kingX];

    if (check === color || !king || king.hasMoved) return castlingMoves;

    const backRank = color === Color.White ? 7 : 0;

    if (kingY !== backRank) return castlingMoves;

    const rooksOnBackRank: { x: number, piece: ChessPiece }[] = [];

    for (let x = 0; x < 8; x++) {
        const piece = pieces[backRank][x];
        if (piece && piece.type === Piece.Rook && piece.color === color && !piece.hasMoved) {
            rooksOnBackRank.push({ x, piece });
        }
    }

    const kingsideRooks = rooksOnBackRank.filter(rook => rook.x > kingX);
    if (kingsideRooks.length > 0) {
        const closestKingsideRook = kingsideRooks.reduce((closest, current) =>
                current.x < closest.x ? current : closest
            , kingsideRooks[0]);

        let pathClear = true;
        for (let x = kingX + 1; x < closestKingsideRook.x; x++) {
            if (pieces[backRank][x]) {
                pathClear = false;
                break;
            }
        }

        const kingsideCastleX = 6;
        let pathSafe = true;

        for (let x = kingX + 1; x <= kingsideCastleX; x++) {
            if (isKingInCheck(x, backRank, color, pieces)) {
                pathSafe = false;
                break;
            }
        }

        if (pathClear && pathSafe) {
            castlingMoves.push({ x: kingsideCastleX, y: backRank });
        }
    }

    const queensideRooks = rooksOnBackRank.filter(rook => rook.x < kingX);
    if (queensideRooks.length > 0) {
        // Use the closest rook to the king
        const closestQueensideRook = queensideRooks.reduce((closest, current) =>
                current.x > closest.x ? current : closest
            , queensideRooks[0]);

        let pathClear = true;
        for (let x = kingX - 1; x > closestQueensideRook.x; x--) {
            if (pieces[backRank][x]) {
                pathClear = false;
                break;
            }
        }

        const queensideCastleX = 2;
        let pathSafe = true;

        for (let x = kingX - 1; x >= queensideCastleX; x--) {
            if (isKingInCheck(x, backRank, color, pieces)) {
                pathSafe = false;
                break;
            }
        }

        if (pathClear && pathSafe) {
            castlingMoves.push({ x: queensideCastleX, y: backRank });
        }
    }

    return castlingMoves;
};