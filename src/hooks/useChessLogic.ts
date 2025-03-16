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

export const useChessLogic = (
    boardState: BoardState,
    setBoardState: Dispatch<SetStateAction<BoardState>>
) => {
    const handlePromotion = (pieceType: ChessPiece['type']) => {
        const { promotion, pieces, currentPlayer, kings } = boardState;

        if (!promotion.pendingMove || !promotion.position || !promotion.color) return;

        const { from, to } = promotion.pendingMove;
        const newPieces = clonePieces(pieces);

        const id = `${promotion.color}_${pieceType}_promoted_${Date.now()}`;

        newPieces[to.y][to.x] = {
            id,
            type: pieceType,
            color: promotion.color,
            hasMoved: true
        };

        newPieces[from.y][from.x] = null;

        const nextPlayer = getNextPlayer(currentPlayer);

        const moveRecord = {
            piece: {
                id,
                type: pieceType,
                color: promotion.color,
                hasMoved: true
            },
            from,
            to
        };

        const newMoveHistory = [...boardState.moveHistory, moveRecord];

        const { check, checkmate } = getCheckStatus(
            newPieces,
            kings,
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
            check,
            checkmate,
            moveHistory: newMoveHistory,
            lastMove: {
                from: from,
                to: to
            },
            promotion: {
                active: false,
                position: null,
                color: null,
                pendingMove: null,
                tileRef: null
            }
        });
    };

    const handleTileClick = (x: number, y: number) => {
        const { pieces, selectedTile, currentPlayer, promotion, checkmate } = boardState;

        if (promotion.active || checkmate) return;

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
        const { pieces, currentPlayer, kings } = boardState;
        const movingPiece = pieces[fromY][fromX]!;

        let newPieces = clonePieces(pieces);
        const newKings = { ...kings };

        if (newPieces[fromY][fromX]) {
            newPieces[fromY][fromX]!.hasMoved = true;
        }

        const moveRecord = {
            piece: { ...movingPiece },
            from: { x: fromX, y: fromY },
            to: { x: toX, y: toY }
        };

        const newMoveHistory = [...boardState.moveHistory, moveRecord];

        switch (movingPiece.type) {
            case Piece.Pawn:

                { if (shouldPromotePawn(movingPiece, toY)) {
                    const tileElement = document.querySelector(
                        `[data-position="${String.fromCharCode(97 + toX)}${8 - toY}"]`
                    ) as HTMLElement;

                    setBoardState({
                        ...boardState,
                        promotion: {
                            active: true,
                            position: { x: toX, y: toY },
                            color: currentPlayer,
                            pendingMove: {
                                from: { x: fromX, y: fromY },
                                to: { x: toX, y: toY }
                            },
                            tileRef: tileElement || null
                        }
                    });
                    return;
                }

                const enPassantTarget = getEnPassantTarget(boardState.moveHistory);
                const { pieces: updatedPieces } = handleEnPassant(
                    newPieces,
                    fromX,
                    toX,
                    toY,
                    currentPlayer,
                    enPassantTarget
                );
                newPieces = updatedPieces;
                break; }

            case Piece.King:
                newPieces = handleCastling(newPieces, fromX, toX, currentPlayer);
                newKings[currentPlayer] = { x: toX, y: toY };
                break;

            default:
                break;
        }

        newPieces[toY][toX] = newPieces[fromY][fromX];
        newPieces[fromY][fromX] = null;

        const nextPlayer = getNextPlayer(currentPlayer);

        const { check, checkmate } = getCheckStatus(
            newPieces,
            newKings,
            nextPlayer,
            {
                ...boardState,
                pieces: newPieces,
                kings: newKings,
                currentPlayer: nextPlayer,
                moveHistory: newMoveHistory
            }
        );

        setBoardState({
            pieces: newPieces,
            selectedTile: null,
            possibleMoves: [],
            currentPlayer: nextPlayer,
            kings: newKings,
            check,
            checkmate,
            moveHistory: newMoveHistory,
            lastMove: {
                from: { x: fromX, y: fromY },
                to: { x: toX, y: toY }
            },
            promotion: {
                active: false,
                position: null,
                color: null,
                pendingMove: null,
                tileRef: null
            },
        });
    };

    return {
        handleTileClick,
        handlePromotion,
        isMoveInPossibleMoves
    };
};