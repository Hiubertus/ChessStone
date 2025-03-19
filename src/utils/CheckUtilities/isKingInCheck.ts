import { CHECK_DIRECTIONS, DIRECTION } from '@/constants';
import { Color, Piece } from '@/enums';
import { ChessPiece, PlayerConfig, Position } from '@/types';
import { isValidPosition } from '@/utils';

type Props = {
  kingX: number;
  kingY: number;
  kingColor: Color;
  pieces: (ChessPiece | null)[][];
  players: PlayerConfig[];
  boardLayout: Position[];
};

export const isKingInCheck = ({
  kingX,
  kingColor,
  players,
  boardLayout,
  pieces,
  kingY,
}: Props): boolean => {
  const opponentColors = players
    .filter(player => player.color !== kingColor)
    .map(player => player.color);

  for (const player of players) {
    if (player.color === kingColor) continue;

    const captureDirections = getPawnCaptureDirections(player);

    for (const dir of captureDirections) {
      const reverseDir = { dx: -dir.dx, dy: -dir.dy };
      const checkX = kingX + reverseDir.dx;
      const checkY = kingY + reverseDir.dy;

      if (isValidPosition({ x: checkX, y: checkY, boardLayout })) {
        const piece = pieces[checkY][checkX];
        if (piece && piece.type === Piece.Pawn && piece.color === player.color) {
          return true;
        }
      }
    }
  }

  for (const move of DIRECTION.KNIGHT) {
    const checkX = kingX + move.dx;
    const checkY = kingY + move.dy;

    if (isValidPosition({ x: checkX, y: checkY, boardLayout })) {
      const piece = pieces[checkY][checkX];
      if (piece && piece.type === Piece.Knight && opponentColors.includes(piece.color)) {
        return true;
      }
    }
  }

  for (const dir of CHECK_DIRECTIONS) {
    let checkX = kingX + dir.dx;
    let checkY = kingY + dir.dy;

    while (isValidPosition({ x: checkX, y: checkY, boardLayout })) {
      const piece = pieces[checkY][checkX];

      if (piece) {
        if (opponentColors.includes(piece.color) && dir.pieces.includes(piece.type)) {
          return true;
        }
        break;
      }

      checkX += dir.dx;
      checkY += dir.dy;
    }
  }

  for (const dir of DIRECTION.KING) {
    const checkX = kingX + dir.dx;
    const checkY = kingY + dir.dy;

    if (isValidPosition({ x: checkX, y: checkY, boardLayout })) {
      const piece = pieces[checkY][checkX];
      if (piece && piece.type === Piece.King && opponentColors.includes(piece.color)) {
        return true;
      }
    }
  }

  return false;
};

const getPawnCaptureDirections = (player: PlayerConfig) => {
  const direction = player.pawnDirection;
  const captureDirections = [];

  if (direction.dy === -1 && direction.dx === 0) {
    captureDirections.push({ dx: -1, dy: -1 });
    captureDirections.push({ dx: 1, dy: -1 });
  } else if (direction.dy === 1 && direction.dx === 0) {
    captureDirections.push({ dx: -1, dy: 1 });
    captureDirections.push({ dx: 1, dy: 1 });
  } else if (direction.dy === 0 && direction.dx === -1) {
    captureDirections.push({ dx: -1, dy: -1 });
    captureDirections.push({ dx: -1, dy: 1 });
  } else if (direction.dy === 0 && direction.dx === 1) {
    captureDirections.push({ dx: 1, dy: -1 });
    captureDirections.push({ dx: 1, dy: 1 });
  } else {
    captureDirections.push({ dx: direction.dx, dy: direction.dy });
    captureDirections.push({
      dx: direction.dx + (direction.dy !== 0 ? 1 : 0),
      dy: direction.dy + (direction.dx !== 0 ? 1 : 0),
    });
  }

  return captureDirections;
};
