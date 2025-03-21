import { BoardConfig, ChessPiece } from '@/types';

type Props = {
  config: BoardConfig;
};

export const initializeBoard = ({ config }: Props): (ChessPiece | null)[][] => {
  let maxRow = 0;
  let maxCol = 0;

  config.allowedPositions.forEach(pos => {
    maxRow = Math.max(maxRow, pos.y);
    maxCol = Math.max(maxCol, pos.x);
  });

  const board: (ChessPiece | null)[][] = Array(maxRow + 1)
    .fill(null)
    .map(() => Array(maxCol + 1).fill(null));

  config.initialPieces.forEach(piece => {
    const { position } = piece;
    const { x, y } = position;

    board[y][x] = {
      ...piece,
    };
  });

  return board;
};
