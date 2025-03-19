import { calculatePossibleMoves } from "@/utils/MoveUtilities/calcualtePossibleMoves";
import { ChessPiece } from "@/types/ChessPiece";
import { BoardState } from "@/types/BoardState";
import { clonePieces } from "@/utils/BoardUtilities/clonePieces";
import { isKingInCheck } from "@/utils/CheckUtilities/isKingInCheck";
import { Piece } from "@/enums/Piece";
import { Position } from "@/types/Position";

export const calculateLegalMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    boardState: BoardState
): Position[] => {
    const piece = pieces[y][x];
    if (!piece) return [];

    const possibleMoves: Position[] = calculatePossibleMoves(x, y, pieces, boardState);
    const legalMoves: Position[] = [];

    for (const move of possibleMoves) {
        const newPieces = clonePieces(pieces);

        newPieces[move.y][move.x] = {
            ...newPieces[y][x]!,
            position: { x: move.x, y: move.y }
        };
        newPieces[y][x] = null;

        let kingPosition: Position | null = null;

        if (piece.type === Piece.King) {
            kingPosition = move;
        } else {
            // Find the king of the current player's color
            for (let ky = 0; ky < newPieces.length; ky++) {
                let found = false;
                for (let kx = 0; kx < newPieces[ky].length; kx++) {
                    const p = newPieces[ky][kx];
                    if (p && p.type === Piece.King && p.color === piece.color) {
                        kingPosition = p.position;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }

        if (!kingPosition) continue;

        if (!isKingInCheck(kingPosition.x, kingPosition.y, piece.color, newPieces, boardState.players)) {
            legalMoves.push(move);
        }
    }

    return legalMoves;
};