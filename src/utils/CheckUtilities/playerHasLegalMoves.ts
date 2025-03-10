import {calculateLegalMoves} from "@/utils/CheckUtilities/calculateLegalMoves.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";

export const playerHasLegalMoves = (
    player: 'white' | 'black',
    pieces: (ChessPiece | null)[][],
    boardState: BoardState
): boolean => {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = pieces[y][x];
            if (piece && piece.color === player) {
                const legalMoves = calculateLegalMoves(x, y, pieces, boardState);
                if (legalMoves.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
};