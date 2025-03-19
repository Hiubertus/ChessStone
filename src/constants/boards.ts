import { BASE_INITIAL_POSITION } from '@/constants/constants.ts';
import { Color, Piece } from '@/enums';
import { BoardConfig, ChessPiece, PlayerConfig, Position } from '@/types';

export const standardBoardConfig = (): BoardConfig => {
  const allowedPositions: Position[] = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      allowedPositions.push({ x, y });
    }
  }

  const players: PlayerConfig[] = [
    {
      color: Color.White,
      pawnDirection: { dx: 0, dy: -1 },
    },
    {
      color: Color.Black,
      pawnDirection: { dx: 0, dy: 1 },
    },
  ];

  const initialPieces = [];
  const backRow = BASE_INITIAL_POSITION.BACK_ROW;
  const generateId = (type: ChessPiece['type'], color: ChessPiece['color'], index: number) =>
    `${color}_${type}_${index}`;

  for (let i = 0; i < 8; i++) {
    initialPieces.push({
      id: generateId(Piece.Pawn, Color.White, i + 1),
      position: { x: i, y: 6 },
      type: Piece.Pawn,
      color: Color.White,
      hasMoved: false,
    });

    initialPieces.push({
      id: generateId(backRow[i], Color.White, Math.floor(i / 2) + 1),
      position: { x: i, y: 7 },
      type: backRow[i],
      color: Color.White,
      hasMoved: false,
    });
  }

  for (let i = 0; i < 8; i++) {
    initialPieces.push({
      id: generateId(Piece.Pawn, Color.Black, i + 1),
      position: { x: i, y: 1 },
      type: Piece.Pawn,
      color: Color.Black,
      hasMoved: false,
    });

    initialPieces.push({
      id: generateId(backRow[i], Color.Black, Math.floor(i / 2) + 1),
      position: { x: i, y: 0 },
      type: backRow[i],
      color: Color.Black,
      hasMoved: false,
    });
  }

  return {
    allowedPositions,
    initialPieces,
    players,
  };
};
