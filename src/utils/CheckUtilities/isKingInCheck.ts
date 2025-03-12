import {CHECK_DIRECTIONS, DIRECTION} from "@/constants/constants.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {isValidPosition} from "@/utils/BoardUtilities/isValidPosition.ts";

export const isKingInCheck = (
    kingX: number,
    kingY: number,
    kingColor: 'white' | 'black',
    pieces: (ChessPiece | null)[][]
): boolean => {
    const opponentColor = kingColor === 'white' ? 'black' : 'white';

    const pawnDirection = kingColor === 'white' ? -1 : 1;
    for (const dx of [-1, 1]) {
        const checkX = kingX + dx;
        const checkY = kingY + pawnDirection;

        if (isValidPosition(checkX, checkY)) {
            const piece = pieces[checkY][checkX];
            if (piece && piece.type === 'pawn' && piece.color === opponentColor) {
                return true;
            }
        }
    }

    for (const move of DIRECTION.KNIGHT) {
        const checkX = kingX + move.dx;
        const checkY = kingY + move.dy;

        if (isValidPosition(checkX, checkY)) {
            const piece = pieces[checkY][checkX];
            if (piece && piece.type === 'knight' && piece.color === opponentColor) {
                return true;
            }
        }
    }

    for (const dir of CHECK_DIRECTIONS) {
        let checkX = kingX + dir.dx;
        let checkY = kingY + dir.dy;

        while (isValidPosition(checkX, checkY)) {
            const piece = pieces[checkY][checkX];

            if (piece) {
                if (piece.color === opponentColor && dir.pieces.includes(piece.type)) {
                    return true;
                }
                break;
            }

            checkX += dir.dx;
            checkY += dir.dy;
        }
    }

    for (const dir of DIRECTION.KING) {
        const checkX = kingX + dir.dx;
        const checkY = kingY + dir.dy;

        if (isValidPosition(checkX, checkY)) {
            const piece = pieces[checkY][checkX];
            if (piece && piece.type === 'king' && piece.color === opponentColor) {
                return true;
            }
        }
    }

    return false;
};