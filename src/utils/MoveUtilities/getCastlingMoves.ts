import {isKingInCheck} from "@/utils/CheckUtilities/isKingInCheck.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {CASTLING} from "@/constants/constants.ts";
import {Color} from "@/enums/Color.ts";
import {Piece} from "@/enums/Piece.ts";
import {Position} from "@/types/Position.ts";

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

    const findRook = (x: number) => {
        const piece = pieces[backRank][x];
        return piece && piece.type === Piece.Rook && piece.color === color && !piece.hasMoved;
    };

    const kingsideRookExists = findRook(7);
    if (kingsideRookExists) {
        const kingsideClear = !pieces[backRank][5] && !pieces[backRank][6];

        if (kingsideClear) {
            const noCheckOnPath = !isKingInCheck(5, backRank, color, pieces) &&
                !isKingInCheck(6, backRank, color, pieces);

            if (noCheckOnPath) {
                castlingMoves.push({ x: kingX + CASTLING.KING_SIDE.kingMove, y: backRank });
            }
        }
    }

    const queensideRookExists = findRook(0);
    if (queensideRookExists) {
        const queensideClear = !pieces[backRank][1] && !pieces[backRank][2] && !pieces[backRank][3];

        if (queensideClear) {
            const noCheckOnPath = !isKingInCheck(3, backRank, color, pieces) &&
                !isKingInCheck(2, backRank, color, pieces);

            if (noCheckOnPath) {
                castlingMoves.push({ x: kingX + CASTLING.QUEEN_SIDE.kingMove, y: backRank });
            }
        }
    }

    return castlingMoves;
};