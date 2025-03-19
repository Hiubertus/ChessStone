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

export const getMovesInDirection = ({
  startX,
  startY,
  directions,
  pieces,
  pieceColor,
  boardLayout,
}: Props): Position[] => {
  const moves: Position[] = [];

  for (const dir of directions) {
    let newX = startX + dir.dx;
    let newY = startY + dir.dy;

    while (isValidPosition({ x: newX, y: newY, boardLayout })) {
      const targetPiece = pieces[newY][newX];

      if (!targetPiece) {
        moves.push({ x: newX, y: newY });
      } else {
        if (targetPiece.color !== pieceColor) {
          moves.push({ x: newX, y: newY });
        }
        break;
      }

      newX += dir.dx;
      newY += dir.dy;
    }
  }

  return moves;
};
