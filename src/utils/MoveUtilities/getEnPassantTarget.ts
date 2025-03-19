import {MoveHistory} from "@/types/MoveHistory.ts";
import {Position} from "@/types/Position.ts";
import {Piece} from "@/enums/Piece.ts";
import {PlayerConfig} from "@/types/BoardConfig.ts";

export const getEnPassantTarget = (
    moveHistory: MoveHistory[],
    players: PlayerConfig[]
): Position | null => {
    if (moveHistory.length === 0) return null;

    const lastMove = moveHistory[moveHistory.length - 1];
    const { piece, from, to } = lastMove;

    if (piece.type !== Piece.Pawn) return null;

    const playerConfig = players.find(player => player.color === piece.color);
    if (!playerConfig) return null;

    const direction = playerConfig.pawnDirection;

    if (
        Math.abs(from.x - to.x) === Math.abs(direction.dx * 2) ||
        Math.abs(from.y - to.y) === Math.abs(direction.dy * 2)
    ) {
        return {
            x: from.x + direction.dx,
            y: from.y + direction.dy
        };
    }

    return null;
};