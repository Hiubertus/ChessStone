import { Color, Piece } from '@/enums';
import { ChessPiece, MoveHistory, PlayerConfig, Position } from '@/types';
import {
  calculateBishopMoves,
  calculateKingMoves,
  calculateKnightMoves,
  calculatePawnMoves,
  calculateQueenMoves,
  calculateRookMoves,
} from '@/utils';

type Props = {
  x: number;
  y: number;
  pieces: (ChessPiece | null)[][];
  moveHistory: MoveHistory[];
  players: PlayerConfig[];
  boardLayout: Position[];
  checksInProgress: Color[];
};

export const calculatePossibleMoves = ({
  x,
  y,
  pieces,
  boardLayout,
  players,
  checksInProgress,
  moveHistory,
}: Props): Position[] => {
  const piece = pieces[y][x];
  if (!piece) return [];

  const { color, type } = piece;

  switch (type) {
    case Piece.Pawn:
      return calculatePawnMoves({
        x,
        y,
        pieces,
        color,
        moveHistory,
        players,
        boardLayout,
      });
    case Piece.Knight:
      return calculateKnightMoves({ x, y, pieces, color, boardLayout });
    case Piece.Bishop:
      return calculateBishopMoves({ x, y, pieces, color, boardLayout });
    case Piece.Rook:
      return calculateRookMoves({ x, y, pieces, color, boardLayout });
    case Piece.Queen:
      return calculateQueenMoves({ x, y, pieces, color, boardLayout });
    case Piece.King:
      return calculateKingMoves({
        x,
        y,
        pieces,
        color,
        checksInProgress,
        players,
        boardLayout,
      });
    default:
      return [];
  }
};
