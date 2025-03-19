import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

import { Piece } from '@/enums';
import { BoardState, ChessPiece, MoveHistory, Position } from '@/types';
import {
  calculateLegalMoves,
  clonePieces,
  getCheckStatus,
  getEnPassantTarget,
  getNextPlayer,
  handleCastling,
  handleEnPassant,
  isValidPosition,
  shouldPromotePawn,
} from '@/utils';

type Props = {
  boardState: BoardState;
  setBoardState: Dispatch<SetStateAction<BoardState>>;
};

export const useChessLogic = ({ boardState, setBoardState }: Props) => {
  const {
    promotion,
    pieces,
    currentPlayer,
    players,
    boardLayout,
    checksInProgress,
    checkmatedPlayers,
    moveHistory,
    selectedTile,
    possibleMoves,
  } = useMemo(() => boardState, [boardState]);

  // Memoizujemy funkcję sprawdzającą, czy ruch jest w możliwych ruchach
  const isMoveInPossibleMoves = useCallback(
    ({ x, y, possibleMoves }: { x: number; y: number; possibleMoves: Position[] }): boolean => {
      return isValidPosition({ x, y, boardLayout: possibleMoves });
    },
    [boardLayout],
  );

  // Memoizujemy handlePromotion, aby nie była tworzona na nowo przy każdym renderowaniu
  const handlePromotion = useCallback(
    (pieceType: ChessPiece['type']) => {
      if (!promotion.pendingMove || !promotion.position || !promotion.color) return;

      const { from, to } = promotion.pendingMove;
      const newPieces = clonePieces({ pieces });

      const id = `${promotion.color}_${pieceType}_promoted_${Date.now()}`;

      newPieces[to.y][to.x] = {
        id,
        type: pieceType,
        color: promotion.color,
        hasMoved: true,
        position: to,
      };

      newPieces[from.y][from.x] = null;

      const nextPlayer = getNextPlayer({ currentPlayer, players });

      const moveRecord: MoveHistory = {
        piece: {
          id,
          type: pieceType,
          color: promotion.color,
          hasMoved: true,
          position: to,
        },
        from,
        to,
      };

      const newMoveHistory = [...boardState.moveHistory, moveRecord];

      const checkStatus = getCheckStatus({
        pieces: newPieces,
        moveHistory,
        players,
        boardLayout,
      });

      setBoardState({
        ...boardState,
        pieces: newPieces,
        selectedTile: null,
        possibleMoves: [],
        currentPlayer: nextPlayer,
        checksInProgress: checkStatus.checksInProgress,
        checkmatedPlayers: checkStatus.checkmatedPlayers,
        moveHistory: newMoveHistory,
        promotion: {
          active: false,
          position: null,
          color: null,
          pendingMove: null,
        },
      });
    },
    [
      boardState,
      pieces,
      promotion,
      currentPlayer,
      players,
      moveHistory,
      boardLayout,
      setBoardState,
    ],
  );

  // Memoizujemy executeMove, aby nie była tworzona na nowo przy każdym renderowaniu
  const executeMove = useCallback(
    (fromX: number, fromY: number, toX: number, toY: number) => {
      const movingPiece = pieces[fromY][fromX]!;

      let newPieces = clonePieces({ pieces });

      if (newPieces[fromY][fromX]) {
        newPieces[fromY][fromX]!.hasMoved = true;
      }

      const moveRecord: MoveHistory = {
        piece: { ...movingPiece },
        from: { x: fromX, y: fromY },
        to: { x: toX, y: toY },
      };

      const newMoveHistory = [...moveHistory, moveRecord];
      const toPosition: Position = { x: toX, y: toY };

      switch (movingPiece.type) {
        case Piece.Pawn: {
          if (
            shouldPromotePawn({
              piece: movingPiece,
              position: toPosition,
              boardLayout,
              players,
            })
          ) {
            setBoardState({
              ...boardState,
              promotion: {
                active: true,
                position: toPosition,
                color: currentPlayer,
                pendingMove: {
                  from: { x: fromX, y: fromY },
                  to: toPosition,
                },
              },
            });
            return;
          }

          const enPassantTarget = getEnPassantTarget({ moveHistory, players });
          const { pieces: updatedPieces } = handleEnPassant({
            pieces: newPieces,
            toX,
            toY,
            color: currentPlayer,
            enPassantTarget,
            players,
          });
          newPieces = updatedPieces;
          break;
        }

        case Piece.King:
          newPieces = handleCastling({
            pieces: newPieces,
            fromX,
            toX,
            color: currentPlayer,
          });
          break;

        default:
          break;
      }

      newPieces[toY][toX] = {
        ...newPieces[fromY][fromX]!,
        position: toPosition,
      };
      newPieces[fromY][fromX] = null;

      const nextPlayer = getNextPlayer({ currentPlayer, players });

      const checkStatus = getCheckStatus({
        pieces: newPieces,
        moveHistory,
        players,
        boardLayout,
      });

      setBoardState({
        ...boardState,
        pieces: newPieces,
        selectedTile: null,
        possibleMoves: [],
        currentPlayer: nextPlayer,
        checksInProgress: checkStatus.checksInProgress,
        checkmatedPlayers: checkStatus.checkmatedPlayers,
        moveHistory: newMoveHistory,
        promotion: {
          active: false,
          position: null,
          color: null,
          pendingMove: null,
        },
      });
    },
    [pieces, moveHistory, boardLayout, players, currentPlayer, boardState, setBoardState],
  );

  // Memoizujemy handleTileClick, aby nie była tworzona na nowo przy każdym renderowaniu
  const handleTileClick = useCallback(
    (x: number, y: number) => {
      if (promotion.active || checkmatedPlayers.includes(currentPlayer)) return;

      const clickedPiece = pieces[y][x];

      if (!selectedTile) {
        if (clickedPiece && clickedPiece.color === currentPlayer) {
          const calculatedMoves = calculateLegalMoves({
            x,
            y,
            pieces,
            moveHistory,
            players,
            boardLayout,
            checksInProgress,
          });
          setBoardState({
            ...boardState,
            selectedTile: { x, y },
            possibleMoves: calculatedMoves,
          });
        }
      } else {
        if (selectedTile.x === x && selectedTile.y === y) {
          setBoardState({
            ...boardState,
            selectedTile: null,
            possibleMoves: [],
          });
        } else if (isMoveInPossibleMoves({ x, y, possibleMoves })) {
          executeMove(selectedTile.x, selectedTile.y, x, y);
        } else if (clickedPiece && clickedPiece.color === currentPlayer) {
          const calculatedMoves = calculateLegalMoves({
            x,
            y,
            pieces,
            moveHistory,
            players,
            boardLayout,
            checksInProgress,
          });
          setBoardState({
            ...boardState,
            selectedTile: { x, y },
            possibleMoves: calculatedMoves,
          });
        }
      }
    },
    [
      promotion.active,
      checkmatedPlayers,
      currentPlayer,
      pieces,
      selectedTile,
      moveHistory,
      players,
      boardLayout,
      checksInProgress,
      possibleMoves,
      boardState,
      setBoardState,
      isMoveInPossibleMoves,
      executeMove,
    ],
  );

  return useMemo(
    () => ({
      handleTileClick,
      handlePromotion,
      isMoveInPossibleMoves,
    }),
    [handleTileClick, handlePromotion, isMoveInPossibleMoves],
  );
};
