import { Tile } from './Tile';
import { PawnPromotion } from "@/components/Piece/PawnPromotion";
import './Board.scss';
import { useChessBoard } from "@/hooks/useChessBoard";
import { useChessLogic } from "@/hooks/useChessLogic";

export const Board = () => {
    const { boardState, setBoardState } = useChessBoard();
    const {
        handleTileClick,
        handlePromotion,
        isMoveInPossibleMoves
    } = useChessLogic(boardState, setBoardState);

    return (
        <div>
            <div className="chess-board">
                {Array(8).fill(null).map((_, y) => (
                    Array(8).fill(null).map((_, x) => {
                        // Determine tile properties
                        const isLight = (x + y) % 2 === 0;
                        const piece = boardState.pieces[y][x];
                        const isSelected = boardState.selectedTile !== null &&
                            boardState.selectedTile.x === x &&
                            boardState.selectedTile.y === y;
                        const isPossibleMove = isMoveInPossibleMoves(x, y, boardState.possibleMoves);
                        const isCheck = boardState.check !== null &&
                            boardState.kings[boardState.check].x === x &&
                            boardState.kings[boardState.check].y === y;

                        // Check if this square was part of the last move
                        const isLastMoveFrom = boardState.lastMove.from !== null &&
                            boardState.lastMove.from.x === x &&
                            boardState.lastMove.from.y === y;

                        const isLastMoveTo = boardState.lastMove.to !== null &&
                            boardState.lastMove.to.x === x &&
                            boardState.lastMove.to.y === y;

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
                    })
                ))}
            </div>

            {/* Pawn Promotion Dialog */}
            {boardState.promotion.active && boardState.promotion.position && boardState.promotion.color && (
                <PawnPromotion
                    position={boardState.promotion.position}
                    color={boardState.promotion.color}
                    onPromote={handlePromotion}
                    isOpen={boardState.promotion.active}
                    tileRef={boardState.promotion.tileRef}
                />
            )}

            <div className="player-info">
                <div>Current player: {boardState.currentPlayer}</div>

                {boardState.check && (
                    <div className="check-status">
                        {boardState.check.toUpperCase()} is in check!
                    </div>
                )}

                {boardState.checkmate && (
                    <div className="checkmate-status">
                        Checkmate! {boardState.checkmate === 'white' ? 'Black' : 'White'} wins!
                    </div>
                )}
            </div>
        </div>
    );
};