import { Color } from '@/enums';
import { ChessPiece, Direction, Position } from '@/types';
import { isValidPosition } from '@/utils';

type Props = {
  startX: number;
  startY: number;
  directions: Direction[];
  pieces: (ChessPiece | null)[][];
  pieceColor: Color;
  boardLayout: Position[];
};

export const getFixedDistanceMoves = ({
  startX,
  boardLayout,
  startY,
  pieces,
  pieceColor,
  directions,
}: Props): Position[] => {
  const moves: Position[] = [];

  for (const dir of directions) {
    const newX = startX + dir.dx;
    const newY = startY + dir.dy;

    if (isValidPosition({ x: newX, y: newY, boardLayout })) {
      const targetPiece = pieces[newY][newX];
      if (!targetPiece || targetPiece.color !== pieceColor) {
        moves.push({ x: newX, y: newY });
      }
    }
  }

  return moves;
};
