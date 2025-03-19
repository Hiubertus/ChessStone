import { Color, Piece } from '@/enums';
import { ChessPiece, MoveHistory, PlayerConfig, Position } from '@/types';
import { calculatePossibleMoves, clonePieces, isKingInCheck } from '@/utils';

type Props = {
  x: number;
  y: number;
  pieces: (ChessPiece | null)[][];
  moveHistory: MoveHistory[];
  players: PlayerConfig[];
  boardLayout: Position[];
  checksInProgress: Color[];
};

export const calculateLegalMoves = ({
  x,
  y,
  pieces,
  moveHistory,
  players,
  boardLayout,
  checksInProgress,
}: Props): Position[] => {
  const piece = pieces[y][x];
  if (!piece) return [];

  const possibleMoves: Position[] = calculatePossibleMoves({
    x,
    y,
    pieces,
    moveHistory,
    players,
    boardLayout,
    checksInProgress,
  });
  const legalMoves: Position[] = [];

  for (const move of possibleMoves) {
    const newPieces = clonePieces({ pieces });

    newPieces[move.y][move.x] = {
      ...newPieces[y][x]!,
      position: { x: move.x, y: move.y },
    };
    newPieces[y][x] = null;

    let kingPosition: Position | null = null;

    if (piece.type === Piece.King) {
      kingPosition = move;
    } else {
      // Find the king of the current player's color
      for (let ky = 0; ky < newPieces.length; ky++) {
        let found = false;
        for (let kx = 0; kx < newPieces[ky].length; kx++) {
          const p = newPieces[ky][kx];
          if (p && p.type === Piece.King && p.color === piece.color) {
            kingPosition = p.position;
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    if (!kingPosition) continue;

    if (
      !isKingInCheck({
        kingX: kingPosition.x,
        kingY: kingPosition.y,
        kingColor: piece.color,
        pieces: newPieces,
        players,
        boardLayout,
      })
    ) {
      legalMoves.push(move);
    }
  }

  return legalMoves;
};
