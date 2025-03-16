import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {isKingInCheck} from "@/utils/CheckUtilities/isKingInCheck.ts";
import {playerHasLegalMoves} from "@/utils/CheckUtilities/playerHasLegalMoves.ts";
import {Color} from "@/enums/Color.ts";

export const getCheckStatus = (
    pieces: (ChessPiece | null)[][],
    kings: BoardState['kings'],
    currentPlayer: Color,
    boardState: BoardState
): { check: Color | null, checkmate: Color | null } => {
    const whiteInCheck = isKingInCheck(kings[Color.White].x, kings[Color.White].y, Color.White, pieces);
    const blackInCheck = isKingInCheck(kings[Color.Black].x, kings[Color.Black].y, Color.Black, pieces);

    let check = null;
    if (whiteInCheck) check = Color.White;
    if (blackInCheck) check = Color.Black;

    let checkmate = null;
    if (check) {
        const hasLegalMoves = playerHasLegalMoves(check, pieces, {
            ...boardState,
            pieces,
            currentPlayer,
            check,
        });

        if (!hasLegalMoves) {
            checkmate = check;
        }
    }

    return { check, checkmate };
};