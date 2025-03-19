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
    const { checksInProgress, players } = boardState;
    const king = pieces[kingY][kingX];

    if (checksInProgress.includes(color) || !king || king.hasMoved) return castlingMoves;

    const playerConfig = players.find(player => player.color === color);
    if (!playerConfig) return castlingMoves;

    let backRank: number;
    const direction = playerConfig.pawnDirection;

    const maxY = Math.max(...boardState.boardLayout.map(pos => pos.y));
    const minY = Math.min(...boardState.boardLayout.map(pos => pos.y));

    if (direction.dy < 0) {
        backRank = maxY;
    } else if (direction.dy > 0) {
        backRank = minY;
    } else if (direction.dx < 0) {
        backRank = kingY;
    } else {
        backRank = kingY;
    }

    if (kingY !== backRank) return castlingMoves;

    const rooksOnSameRank: { x: number, piece: ChessPiece }[] = [];

    for (let x = 0; x < pieces[backRank].length; x++) {
        const piece = pieces[backRank][x];
        if (piece && piece.type === Piece.Rook && piece.color === color && !piece.hasMoved) {
            rooksOnSameRank.push({ x, piece });
        }
    }

    const kingsideRooks = rooksOnSameRank.filter(rook => rook.x > kingX);
    if (kingsideRooks.length > 0) {
        const closestKingsideRook = kingsideRooks.reduce(
            (closest, current) => current.x < closest.x ? current : closest,
            kingsideRooks[0]
        );

        let pathClear = true;
        for (let x = kingX + 1; x < closestKingsideRook.x; x++) {
            if (pieces[backRank][x]) {
                pathClear = false;
                break;
            }
        }

        const kingsideCastleX = kingX + 2;
        let pathSafe = true;

        for (let x = kingX + 1; x <= kingsideCastleX; x++) {
            if (isKingInCheck(x, backRank, color, pieces, players)) {
                pathSafe = false;
                break;
            }
        }

        if (pathClear && pathSafe) {
            castlingMoves.push({ x: kingsideCastleX, y: backRank });
        }
    }

    // Handle queenside castling (rooks to the left of the king)
    const queensideRooks = rooksOnSameRank.filter(rook => rook.x < kingX);
    if (queensideRooks.length > 0) {
        const closestQueensideRook = queensideRooks.reduce(
            (closest, current) => current.x > closest.x ? current : closest,
            queensideRooks[0]
        );

        let pathClear = true;
        for (let x = kingX - 1; x > closestQueensideRook.x; x--) {
            if (pieces[backRank][x]) {
                pathClear = false;
                break;
            }
        }

        const queensideCastleX = kingX - 2;
        let pathSafe = true;

        for (let x = kingX - 1; x >= queensideCastleX; x--) {
            if (isKingInCheck(x, backRank, color, pieces, players)) {
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