import { useState } from 'react';

import { BoardConfig, BoardState } from '@/types';
import { initializeBoard } from '@/utils';

type Props = {
  config: BoardConfig;
};

export const useChessBoard = ({ config }: Props) => {
  const initialPieces = initializeBoard({ config });

  const initialState: BoardState = {
    pieces: initialPieces,
    selectedTile: null,
    possibleMoves: [],
    currentPlayer: config.players[0].color,
    players: config.players,
    checksInProgress: [],
    checkmatedPlayers: [],
    moveHistory: [],
    promotion: {
      active: false,
      position: null,
      color: null,
      pendingMove: null,
    },
    boardLayout: config.allowedPositions,
  };

  const [boardState, setBoardState] = useState<BoardState>(initialState);

  return { boardState, setBoardState };
};
