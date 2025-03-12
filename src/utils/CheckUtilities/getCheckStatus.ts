import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {isKingInCheck} from "@/utils/CheckUtilities/isKingInCheck.ts";
import {playerHasLegalMoves} from "@/utils/CheckUtilities/playerHasLegalMoves.ts";

export const getCheckStatus = (
    pieces: (ChessPiece | null)[][],
    kings: BoardState['kings'],
    currentPlayer: 'white' | 'black',
    boardState: BoardState
): { check: 'white' | 'black' | null, checkmate: 'white' | 'black' | null } => {
    const whiteInCheck = isKingInCheck(kings.white.x, kings.white.y, 'white', pieces);
    const blackInCheck = isKingInCheck(kings.black.x, kings.black.y, 'black', pieces);

    let check: 'white' | 'black' | null = null;
    if (whiteInCheck) check = 'white';
    if (blackInCheck) check = 'black';

    let checkmate: 'white' | 'black' | null = null;
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