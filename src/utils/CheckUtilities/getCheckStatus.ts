import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {isKingInCheck} from "@/utils/CheckUtilities/isKingInCheck.ts";
import {playerHasLegalMoves} from "@/utils/CheckUtilities/playerHasLegalMoves.ts";
import {Color} from "@/enums/Color.ts";
import {Piece} from "@/enums/Piece.ts";

export const getCheckStatus = (
    pieces: (ChessPiece | null)[][],
    currentPlayer: Color,
    boardState: BoardState
): { checksInProgress: Color[], checkmatedPlayers: Color[] } => {
    const checksInProgress: Color[] = [];
    const allPieces: ChessPiece[] = [];

    for (let y = 0; y < pieces.length; y++) {
        for (let x = 0; x < pieces[y].length; x++) {
            if (pieces[y][x]) {
                allPieces.push(pieces[y][x]!);
            }
        }
    }

    const kings = allPieces.filter(piece => piece.type === Piece.King);

    for (const king of kings) {
        const { x, y } = king.position;
        if (isKingInCheck(x, y, king.color, pieces, boardState.players)) {
            checksInProgress.push(king.color);
        }
    }

    const checkmatedPlayers: Color[] = [];

    for (const color of checksInProgress) {
        const hasLegalMoves = playerHasLegalMoves(color, pieces, {
            ...boardState,
            pieces,
            currentPlayer,
            checksInProgress
        });

        if (!hasLegalMoves) {
            checkmatedPlayers.push(color);
        }
    }

    return { checksInProgress, checkmatedPlayers };
};