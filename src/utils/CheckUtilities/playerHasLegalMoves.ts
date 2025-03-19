import { Color } from '@/enums';
import { ChessPiece, MoveHistory, PlayerConfig, Position } from '@/types';
import { calculateLegalMoves } from '@/utils';

type Props = {
  player: Color;
  pieces: (ChessPiece | null)[][];
  moveHistory: MoveHistory[];
  players: PlayerConfig[];
  boardLayout: Position[];
  checksInProgress: Color[];
};

export const playerHasLegalMoves = ({
  players,
  player,
  pieces,
  moveHistory,
  boardLayout,
  checksInProgress,
}: Props): boolean => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = pieces[y][x];
      if (piece && piece.color === player) {
        const legalMoves = calculateLegalMoves({
          x,
          y,
          pieces,
          moveHistory,
          players,
          boardLayout,
          checksInProgress,
        });
        if (legalMoves.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
};
