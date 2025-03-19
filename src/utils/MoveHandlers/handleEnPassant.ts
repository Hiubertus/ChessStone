import {Position} from "@/types/Position.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {Color} from "@/enums/Color.ts";
import {PlayerConfig} from "@/types/BoardConfig.ts";

export const handleEnPassant = (
    pieces: (ChessPiece | null)[][],
    toX: number,
    toY: number,
    color: Color,
    enPassantTarget: Position | null,
    players: PlayerConfig[]
): { pieces: (ChessPiece | null)[][], isEnPassant: boolean } => {
    if (!enPassantTarget) return { pieces, isEnPassant: false };

    const isEnPassant = enPassantTarget.x === toX && enPassantTarget.y === toY;

    if (isEnPassant) {
        const playerConfig = players.find(player => player.color === color);
        if (!playerConfig) return { pieces, isEnPassant: false };

        const direction = playerConfig.pawnDirection;

        const capturedPawnX = toX;
        const capturedPawnY = toY - direction.dy;

        pieces[capturedPawnY][capturedPawnX] = null;
        return { pieces, isEnPassant: true };
    }

    return { pieces, isEnPassant: false };
};