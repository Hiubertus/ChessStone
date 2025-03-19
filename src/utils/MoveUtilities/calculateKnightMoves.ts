import { DIRECTION } from '@/constants';
import { Color } from '@/enums';
import { ChessPiece, Position } from '@/types';
import { getFixedDistanceMoves } from '@/utils';

type Props = {
  x: number;
  y: number;
  pieces: (ChessPiece | null)[][];
  color: Color;
  boardLayout: Position[];
};

export const calculateKnightMoves = ({ x, y, boardLayout, color, pieces }: Props): Position[] => {
  return getFixedDistanceMoves({
    startX: x,
    startY: y,
    directions: DIRECTION.KNIGHT,
    pieces,
    pieceColor: color,
    boardLayout,
  });
};
