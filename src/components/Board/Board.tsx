import './Board.scss';

import { useCallback, useMemo } from 'react';

import { PawnPromotion, Tile } from '@/components';
import { standardBoardConfig } from '@/constants';
import { Piece } from '@/enums';
import { useChessBoard, useChessLogic } from '@/hooks';
import { MoveHistory, Position } from '@/types';

export const Board = () => {
  const { boardState, setBoardState } = useChessBoard({
    config: standardBoardConfig(),
  });
  const { handleTileClick, handlePromotion, isMoveInPossibleMoves } = useChessLogic({
    boardState,
    setBoardState,
  });

  const { rows, cols, boardLayout } = useMemo(() => {
    let maxRows = 0;
    let maxCols = 0;

    boardState.boardLayout.forEach(pos => {
      maxRows = Math.max(maxRows, pos.y + 1);
      maxCols = Math.max(maxCols, pos.x + 1);
    });

    return {
      rows: maxRows,
      cols: maxCols,
      boardLayout: boardState.boardLayout,
    };
  }, [boardState.boardLayout]);

  const isPositionAllowed = useCallback(
    (x: number, y: number): boolean => {
      return boardLayout.some(pos => pos.x === x && pos.y === y);
    },
    [boardLayout],
  );

  const createTileClickHandler = useCallback(
    (x: number, y: number) => {
      return () => handleTileClick(x, y);
    },
    [handleTileClick],
  );

  const getLastMove = useMemo((): MoveHistory | null => {
    return boardState.moveHistory.length > 0
      ? boardState.moveHistory[boardState.moveHistory.length - 1]
      : null;
  }, [boardState.moveHistory]);

  const boardGrid = useMemo(() => {
    return Array(rows)
      .fill(null)
      .map((_, y) =>
        Array(cols)
          .fill(null)
          .map((_, x) => {
            if (!isPositionAllowed(x, y)) {
              return null;
            }

            const isLight = (x + y) % 2 === 0;
            const piece = boardState.pieces[y]?.[x] || null;
            const isSelected =
              boardState.selectedTile !== null &&
              boardState.selectedTile.x === x &&
              boardState.selectedTile.y === y;
            const isPossibleMove = isMoveInPossibleMoves({
              x,
              y,
              possibleMoves: boardState.possibleMoves,
            });

            let isCheck = false;
            if (boardState.checksInProgress.length > 0 && piece) {
              isCheck =
                piece.type === Piece.King && boardState.checksInProgress.includes(piece.color);
            }

            const isLastMoveFrom =
              getLastMove !== null && getLastMove.from.x === x && getLastMove.from.y === y;

            const isLastMoveTo =
              getLastMove !== null && getLastMove.to.x === x && getLastMove.to.y === y;

            const position: Position = { x, y };

            return {
              key: `${x},${y}`,
              position,
              isLight,
              piece,
              isSelected,
              isPossibleMove,
              isCheck,
              isLastMoveFrom,
              isLastMoveTo,
              onClick: createTileClickHandler(x, y),
            };
          }),
      );
  }, [
    rows,
    cols,
    isPositionAllowed,
    boardState.pieces,
    boardState.selectedTile,
    boardState.possibleMoves,
    boardState.checksInProgress,
    getLastMove,
    isMoveInPossibleMoves,
    createTileClickHandler,
  ]);

  const gridStyles = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 60px)`,
      gridTemplateRows: `repeat(${rows}, 60px)`,
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      border: '2px solid #333',
    }),
    [cols, rows],
  );

  const PlayerInfo = useMemo(() => {
    const { currentPlayer, checksInProgress, checkmatedPlayers, players } = boardState;

    return (
      <div className="player-info">
        <div>Current player: {currentPlayer}</div>

        {checksInProgress.length > 0 && (
          <div className="check-status">
            {checksInProgress.map(color => (
              <div key={color}>{color.toUpperCase()} is in check!</div>
            ))}
          </div>
        )}

        {checkmatedPlayers.length > 0 && (
          <div className="checkmate-status">
            Checkmate!{' '}
            {checkmatedPlayers.map(color => (
              <span key={color}>{color.toUpperCase()}</span>
            ))}
            {checkmatedPlayers.length === 1 && players.length === 2 && (
              <span>
                {' '}
                has lost. {
                  players.find(player => player.color !== checkmatedPlayers[0])?.color
                }{' '}
                wins!
              </span>
            )}
            {checkmatedPlayers.length > 1 && <span> have lost.</span>}
          </div>
        )}
      </div>
    );
  }, [
    boardState.currentPlayer,
    boardState.checksInProgress,
    boardState.checkmatedPlayers,
    boardState.players,
  ]);

  return (
    <div>
      <div className="chess-board" style={gridStyles}>
        {boardGrid.map(row =>
          row.map(
            tileProps =>
              tileProps && (
                <Tile
                  key={tileProps.key}
                  position={tileProps.position}
                  isLight={tileProps.isLight}
                  piece={tileProps.piece}
                  isSelected={tileProps.isSelected}
                  isPossibleMove={tileProps.isPossibleMove}
                  isCheck={tileProps.isCheck}
                  isLastMoveFrom={tileProps.isLastMoveFrom}
                  isLastMoveTo={tileProps.isLastMoveTo}
                  onClick={tileProps.onClick}
                />
              ),
          ),
        )}
      </div>

      {boardState.promotion.active &&
        boardState.promotion.position &&
        boardState.promotion.color && (
          <PawnPromotion
            position={boardState.promotion.position}
            color={boardState.promotion.color}
            onPromote={handlePromotion}
            isOpen={boardState.promotion.active}
          />
        )}

      {PlayerInfo}
    </div>
  );
};
