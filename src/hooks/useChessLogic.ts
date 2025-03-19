import { Dispatch, SetStateAction } from "react";
import { ChessPiece } from "@/types/ChessPiece";
import { BoardState } from "@/types/BoardState";
import { clonePieces } from "@/utils/BoardUtilities/clonePieces.ts";
import { getCheckStatus } from "@/utils/CheckUtilities/getCheckStatus.ts";
import { getNextPlayer } from "@/utils/BoardUtilities/getNextPlayer.ts";
import { calculateLegalMoves } from "@/utils/CheckUtilities/calculateLegalMoves.ts";
import { isMoveInPossibleMoves } from "@/utils/BoardUtilities/isMoveInPossibleMoves.ts";
import { shouldPromotePawn } from "@/utils/BoardUtilities/shouldPromotePawn.ts";
import { getEnPassantTarget } from "@/utils/MoveUtilities/getEnPassantTarget.ts";
import { handleCastling} from "@/utils/MoveHandlers/handleCastling.ts";
import { handleEnPassant} from "@/utils/MoveHandlers/handleEnPassant.ts";
import { Piece } from "@/enums/Piece.ts";
import { MoveHistory } from "@/types/MoveHistory.ts";
import { Position } from "@/types/Position.ts";

export const useChessLogic = (
    boardState: BoardState,
    setBoardState: Dispatch<SetStateAction<BoardState>>
) => {
    const handlePromotion = (pieceType: ChessPiece['type']) => {
        const { promotion, pieces, currentPlayer, players } = boardState;

        if (!promotion.pendingMove || !promotion.position || !promotion.color) return;

        const { from, to } = promotion.pendingMove;
        const newPieces = clonePieces(pieces);

        const id = `${promotion.color}_${pieceType}_promoted_${Date.now()}`;

        // Create the promoted piece with the correct position
        newPieces[to.y][to.x] = {
            id,
            type: pieceType,
            color: promotion.color,
            hasMoved: true,
            position: to,
        };

        newPieces[from.y][from.x] = null;

        const nextPlayer = getNextPlayer(currentPlayer, players);

        // Create a move record
        const moveRecord: MoveHistory = {
            piece: {
                id,
                type: pieceType,
                color: promotion.color,
                hasMoved: true,
                position: to,
            },
            from,
            to
        };

        const newMoveHistory = [...boardState.moveHistory, moveRecord];

        const { checksInProgress, checkmatedPlayers } = getCheckStatus(
            newPieces,
            nextPlayer,
            {
                ...boardState,
                pieces: newPieces,
                currentPlayer: nextPlayer,
                moveHistory: newMoveHistory
            }
        );

        setBoardState({
            ...boardState,
            pieces: newPieces,
            selectedTile: null,
            possibleMoves: [],
            currentPlayer: nextPlayer,
            checksInProgress,
            checkmatedPlayers,
            moveHistory: newMoveHistory,
            promotion: {
                active: false,
                position: null,
                color: null,
                pendingMove: null,
            }
        });
    };

    const handleTileClick = (x: number, y: number) => {
        const {
            pieces,
            selectedTile,
            currentPlayer,
            promotion,
            checkmatedPlayers
        } = boardState;

        if (promotion.active || checkmatedPlayers.includes(currentPlayer)) return;

        const clickedPiece = pieces[y][x];

        if (!selectedTile) {
            if (clickedPiece && clickedPiece.color === currentPlayer) {
                const possibleMoves = calculateLegalMoves(x, y, pieces, boardState);
                setBoardState({
                    ...boardState,
                    selectedTile: { x, y },
                    possibleMoves
                });
            }
        }
        else {
            if (selectedTile.x === x && selectedTile.y === y) {
                setBoardState({
                    ...boardState,
                    selectedTile: null,
                    possibleMoves: []
                });
            }
            else if (isMoveInPossibleMoves(x, y, boardState.possibleMoves)) {
                executeMove(selectedTile.x, selectedTile.y, x, y);
            }
            else if (clickedPiece && clickedPiece.color === currentPlayer) {
                const possibleMoves = calculateLegalMoves(x, y, pieces, boardState);
                setBoardState({
                    ...boardState,
                    selectedTile: { x, y },
                    possibleMoves
                });
            }
        }
    };

    const executeMove = (fromX: number, fromY: number, toX: number, toY: number) => {
        const { pieces, currentPlayer, players, moveHistory } = boardState;
        const movingPiece = pieces[fromY][fromX]!;

        let newPieces = clonePieces(pieces);

        if (newPieces[fromY][fromX]) {
            newPieces[fromY][fromX]!.hasMoved = true;
        }

        const moveRecord: MoveHistory = {
            piece: { ...movingPiece },
            from: { x: fromX, y: fromY },
            to: { x: toX, y: toY }
        };

        const newMoveHistory = [...moveHistory, moveRecord];
        const toPosition: Position = { x: toX, y: toY };

        switch (movingPiece.type) {
            case Piece.Pawn: {
                if (shouldPromotePawn(movingPiece, toPosition, boardState)) {
                    setBoardState({
                        ...boardState,
                        promotion: {
                            active: true,
                            position: toPosition,
                            color: currentPlayer,
                            pendingMove: {
                                from: { x: fromX, y: fromY },
                                to: toPosition
                            },
                        }
                    });
                    return;
                }

                const enPassantTarget = getEnPassantTarget(moveHistory, players);
                const { pieces: updatedPieces } = handleEnPassant(
                    newPieces,
                    toX,
                    toY,
                    currentPlayer,
                    enPassantTarget,
                    players
                );
                newPieces = updatedPieces;
                break;
            }

            case Piece.King:
                newPieces = handleCastling(newPieces, fromX, toX, currentPlayer);
                break;

            default:
                break;
        }

        newPieces[toY][toX] = {
            ...newPieces[fromY][fromX]!,
            position: toPosition
        };
        newPieces[fromY][fromX] = null;

        const nextPlayer = getNextPlayer(currentPlayer, players);

        const { checksInProgress, checkmatedPlayers } = getCheckStatus(
            newPieces,
            nextPlayer,
            {
                ...boardState,
                pieces: newPieces,
                currentPlayer: nextPlayer,
                moveHistory: newMoveHistory
            }
        );

        setBoardState({
            ...boardState,
            pieces: newPieces,
            selectedTile: null,
            possibleMoves: [],
            currentPlayer: nextPlayer,
            checksInProgress,
            checkmatedPlayers,
            moveHistory: newMoveHistory,
            promotion: {
                active: false,
                position: null,
                color: null,
                pendingMove: null,
            },
        });
    };

    return {
        handleTileClick,
        handlePromotion,
        isMoveInPossibleMoves
    };
};