import { ChessPiece } from "@/types/ChessPiece.ts";
import { Piece } from "@/enums/Piece.ts";
import { BoardState } from "@/types/BoardState.ts";
import { Position } from "@/types/Position.ts";

export const shouldPromotePawn = (
    piece: ChessPiece,
    position: Position,
    boardState: BoardState
): boolean => {
    if (piece.type !== Piece.Pawn) return false;

    const promotionPositions = getPromotionPositions(boardState);

    return promotionPositions.some(pos =>
        pos.x === position.x && pos.y === position.y && pos.color === piece.color
    );
};

type PromotionPosition = Position & { color: ChessPiece['color'] };

const getPromotionPositions = (boardState: BoardState): PromotionPosition[] => {
    const { boardLayout, players } = boardState;
    const result: PromotionPosition[] = [];

    const maxX = Math.max(...boardLayout.map(pos => pos.x));
    const maxY = Math.max(...boardLayout.map(pos => pos.y));
    const minX = Math.min(...boardLayout.map(pos => pos.x));
    const minY = Math.min(...boardLayout.map(pos => pos.y));

    players.forEach(player => {
        const direction = player.pawnDirection;

        const promotionPositions: Position[] = [];

        if (direction.dy < 0) {
            for (let x = minX; x <= maxX; x++) {
                promotionPositions.push({ x, y: minY });
            }
        } else if (direction.dy > 0) {
            for (let x = minX; x <= maxX; x++) {
                promotionPositions.push({ x, y: maxY });
            }
        } else if (direction.dx < 0) {
            for (let y = minY; y <= maxY; y++) {
                promotionPositions.push({ x: minX, y });
            }
        } else if (direction.dx > 0) {
            for (let y = minY; y <= maxY; y++) {
                promotionPositions.push({ x: maxX, y });
            }
        }

        const validPromotionPositions = promotionPositions.filter(pos =>
            boardLayout.some(boardPos => boardPos.x === pos.x && boardPos.y === pos.y)
        );

        validPromotionPositions.forEach(pos => {
            result.push({ ...pos, color: player.color });
        });
    });

    return result;
};