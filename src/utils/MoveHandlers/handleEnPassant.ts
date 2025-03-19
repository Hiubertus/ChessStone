import { Color } from '@/enums';
import { ChessPiece, PlayerConfig, Position } from '@/types';

type Props = {
  pieces: (ChessPiece | null)[][];
  toX: number;
  toY: number;
  color: Color;
  enPassantTarget: Position | null;
  players: PlayerConfig[];
};

export const handleEnPassant = ({
  pieces,
  players,
  color,
  enPassantTarget,
  toX,
  toY,
}: Props): { pieces: (ChessPiece | null)[][]; isEnPassant: boolean } => {
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
