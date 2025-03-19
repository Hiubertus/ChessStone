import { DIRECTION } from '@/constants';
import { Color } from '@/enums';
import { ChessPiece, Position } from '@/types';
import { getMovesInDirection } from '@/utils';

type Props = {
  x: number;
  y: number;
  pieces: (ChessPiece | null)[][];
  color: Color;
  boardLayout: Position[];
};

export const calculateBishopMoves = ({ x, y, boardLayout, color, pieces }: Props): Position[] => {
  return getMovesInDirection({
    startX: x,
    startY: y,
    directions: DIRECTION.DIAGONAL,
    pieces,
    pieceColor: color,
    boardLayout,
  });
};
