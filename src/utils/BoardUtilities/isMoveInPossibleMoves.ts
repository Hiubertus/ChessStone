import { Position } from '@/types';

type Props = {
  x: number;
  y: number;
  possibleMoves: Position[];
};

export const isMoveInPossibleMoves = ({ x, y, possibleMoves }: Props): boolean => {
  return possibleMoves.some(move => move.x === x && move.y === y);
};
