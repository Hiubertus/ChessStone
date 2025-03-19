import { Color, Piece } from '@/enums';
import { ChessPiece, MoveHistory, PlayerConfig, Position } from '@/types';
import { isKingInCheck, playerHasLegalMoves } from '@/utils';

type Props = {
  pieces: (ChessPiece | null)[][];
  moveHistory: MoveHistory[];
  players: PlayerConfig[];
  boardLayout: Position[];
};

export const getCheckStatus = ({
  pieces,
  boardLayout,
  players,
  moveHistory,
}: Props): { checksInProgress: Color[]; checkmatedPlayers: Color[] } => {
  const checksInProgress: Color[] = [];
  const allPieces: ChessPiece[] = [];

  for (let y = 0; y < pieces.length; y++) {
    for (let x = 0; x < pieces[y].length; x++) {
      if (pieces[y][x]) {
        allPieces.push(pieces[y][x]!);
      }
    }
  }

  const kings = allPieces.filter(piece => piece.type === Piece.King);

  for (const king of kings) {
    const { x, y } = king.position;
    if (
      isKingInCheck({
        kingX: x,
        kingY: y,
        kingColor: king.color,
        pieces,
        players,
        boardLayout,
      })
    ) {
      checksInProgress.push(king.color);
    }
  }

  const checkmatedPlayers: Color[] = [];

  for (const color of checksInProgress) {
    const hasLegalMoves = playerHasLegalMoves({
      player: color,
      pieces,
      moveHistory,
      players,
      boardLayout,
      checksInProgress,
    });

    if (!hasLegalMoves) {
      checkmatedPlayers.push(color);
    }
  }

  return { checksInProgress, checkmatedPlayers };
};
