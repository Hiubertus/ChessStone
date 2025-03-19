import { DIRECTION } from '@/constants';
import { Color } from '@/enums';
import { ChessPiece, PlayerConfig, Position } from '@/types';
import { getCastlingMoves, getFixedDistanceMoves } from '@/utils';

type Props = {
  x: number;
  y: number;
  pieces: (ChessPiece | null)[][];
  color: Color;
  checksInProgress: Color[];
  players: PlayerConfig[];
  boardLayout: Position[];
};

export const calculateKingMoves = ({
  x,
  y,
  pieces,
  players,
  boardLayout,
  checksInProgress,
  color,
}: Props): Position[] => {
  const normalMoves: Position[] = getFixedDistanceMoves({
    startX: x,
    startY: y,
    directions: DIRECTION.KING,
    pieces,
    pieceColor: color,
    boardLayout,
  });
  const castlingMoves: Position[] = getCastlingMoves({
    kingX: x,
    kingY: y,
    pieces,
    color,
    checksInProgress,
    players,
    boardLayout,
  });

  return [...normalMoves, ...castlingMoves];
};
