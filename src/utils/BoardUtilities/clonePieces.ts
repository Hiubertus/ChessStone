import { ChessPiece } from '@/types';

type Props = {
  pieces: (ChessPiece | null)[][];
};

export const clonePieces = ({ pieces }: Props): (ChessPiece | null)[][] => {
  return pieces.map(row => [...row]);
};
