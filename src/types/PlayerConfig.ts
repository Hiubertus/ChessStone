import { Color } from '@/enums';
import { Direction } from '@/types/Direction.ts';

export type PlayerConfig = {
  color: Color;
  pawnDirection: Direction;
};
