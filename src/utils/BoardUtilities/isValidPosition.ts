import { Position } from '@/types';

type Props = {
  x: number;
  y: number;
  boardLayout: Position[];
};

export const isValidPosition = ({ x, y, boardLayout }: Props): boolean => {
  return boardLayout.some(pos => pos.x === x && pos.y === y);
};
