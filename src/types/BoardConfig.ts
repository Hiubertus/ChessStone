import { ChessPiece } from '@/types/ChessPiece.ts';
import { PlayerConfig } from '@/types/PlayerConfig.ts';
import { Position } from '@/types/Position.ts';

export type BoardConfig = {
  allowedPositions: Position[];
  initialPieces: ChessPiece[];
  players: PlayerConfig[];
};
