import './Board.scss';

import { PawnPromotion } from '@/components';
import { standardBoardConfig } from '@/constants';
import { Piece } from '@/enums';
import { useChessBoard, useChessLogic } from '@/hooks';
import { isValidPosition } from '@/utils';

import { Tile } from './Tile';

export const Board = () => {
  const { boardState, setBoardState } = useChessBoard({
    config: standardBoardConfig(),
  });
  const { handleTileClick, handlePromotion, isMoveInPossibleMoves } = useChessLogic({
    boardState,
    setBoardState,
  });

  const getMaxDimensions = () => {
    let maxRows = 0;
    let maxCols = 0;

    boardState.boardLayout.forEach(pos => {
      maxRows = Math.max(maxRows, pos.y + 1);
      maxCols = Math.max(maxCols, pos.x + 1);
    });

    return { rows: maxRows, cols: maxCols };
  };

  const { rows, cols } = getMaxDimensions();

  const lastMove =
    boardState.moveHistory.length > 0
      ? boardState.moveHistory[boardState.moveHistory.length - 1]
      : null;

  return (
    <div>
      <div
        className="chess-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 60px)`,
          gridTemplateRows: `repeat(${rows}, 60px)`,
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          border: '2px solid #333',
        }}
      >
        {Array(rows)
          .fill(null)
          .map((_, y) =>
            Array(cols)
              .fill(null)
              .map((_, x) => {
                if (
                  !isValidPosition({
                    x,
                    y,
                    boardLayout: boardState.boardLayout,
                  })
                ) {
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
                  lastMove !== null && lastMove.from.x === x && lastMove.from.y === y;

                const isLastMoveTo =
                  lastMove !== null && lastMove.to.x === x && lastMove.to.y === y;

                return (
                  <Tile
                    key={`${x},${y}`}
                    position={{ x, y }}
                    isLight={isLight}
                    piece={piece}
                    isSelected={isSelected}
                    isPossibleMove={isPossibleMove}
                    isCheck={isCheck}
                    isLastMoveFrom={isLastMoveFrom}
                    isLastMoveTo={isLastMoveTo}
                    onClick={() => handleTileClick(x, y)}
                  />
                );
              }),
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

      <div className="player-info">
        <div>Current player: {boardState.currentPlayer}</div>

        {boardState.checksInProgress.length > 0 && (
          <div className="check-status">
            {boardState.checksInProgress.map(color => (
              <div key={color}>{color.toUpperCase()} is in check!</div>
            ))}
          </div>
        )}

        {boardState.checkmatedPlayers.length > 0 && (
          <div className="checkmate-status">
            Checkmate!{' '}
            {boardState.checkmatedPlayers.map(color => (
              <span key={color}>{color.toUpperCase()}</span>
            ))}
            {boardState.checkmatedPlayers.length === 1 && boardState.players.length === 2 && (
              <span>
                {' '}
                has lost.{' '}
                {
                  boardState.players.find(
                    player => player.color !== boardState.checkmatedPlayers[0],
                  )?.color
                }{' '}
                wins!
              </span>
            )}
            {boardState.checkmatedPlayers.length > 1 && <span> have lost.</span>}
          </div>
        )}
      </div>
    </div>
  );
};
