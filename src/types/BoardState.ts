import { Color } from '@/enums';
import { ChessPiece } from '@/types/ChessPiece.ts';
import { MoveHistory } from '@/types/MoveHistory.ts';
import { PlayerConfig } from '@/types/PlayerConfig.ts';
import { Position } from '@/types/Position.ts';

export type BoardState = {
  pieces: (ChessPiece | null)[][];
  selectedTile: Position | null;
  possibleMoves: Position[];
  currentPlayer: Color;
  players: PlayerConfig[];
  checksInProgress: Color[];
  checkmatedPlayers: Color[];
  moveHistory: MoveHistory[];
  promotion: {
    active: boolean;
    position: Position | null;
    color: Color | null;
    pendingMove: {
      from: Position;
      to: Position;
    } | null;
  };
  boardLayout: Position[];
};
