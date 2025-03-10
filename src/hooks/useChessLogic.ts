
import { Dispatch, SetStateAction } from "react";
import { ChessPiece } from "@/types/ChessPiece";
import { BoardState } from "@/types/BoardState";
import {clonePieces} from "@/utils/BoardUtilities/clonePieces.ts";
import {getCheckStatus} from "@/utils/CheckUtilities/getCheckStatus.ts";
import {getNextPlayer} from "@/utils/BoardUtilities/getNextPlayer.ts";
import {calculateLegalMoves} from "@/utils/CheckUtilities/calculateLegalMoves.ts";
import {isMoveInPossibleMoves} from "@/utils/BoardUtilities/isMoveInPossibleMoves.ts";
import {shouldPromotePawn} from "@/utils/BoardUtilities/shouldPromotePawn.ts";


export const useChessLogic = (
    boardState: BoardState,
    setBoardState: Dispatch<SetStateAction<BoardState>>
) => {
    // Handle pawn promotion selection
    const handlePromotion = (pieceType: ChessPiece['type']) => {
        const { promotion, pieces, currentPlayer, kings } = boardState;

        if (!promotion.pendingMove || !promotion.position || !promotion.color) return;

        const { from, to } = promotion.pendingMove;
        const newPieces = clonePieces(pieces);

        // Generate a unique ID for the new piece
        const id = `${promotion.color}_${pieceType}_promoted_${Date.now()}`;

        // Replace the pawn with the selected piece
        newPieces[to.y][to.x] = {
            id,
            type: pieceType,
            color: promotion.color
        };

        // Remove the pawn from its original position
        newPieces[from.y][from.x] = null;

        // Change player
        const nextPlayer = getNextPlayer(currentPlayer);

        // Check for check/checkmate conditions
        const { check, checkmate } = getCheckStatus(
            newPieces,
            kings,
            nextPlayer,
            {
                ...boardState,
                pieces: newPieces,
                currentPlayer: nextPlayer
            }
        );

        // Record the move in history
        const moveRecord = {
            piece: {
                id,
                type: pieceType,
                color: promotion.color
            },
            from,
            to
        };

        // Update board state
        setBoardState({
            ...boardState,
            pieces: newPieces,
            selectedTile: null,
            possibleMoves: [],
            currentPlayer: nextPlayer,
            check,
            checkmate,
            enPassantTarget: null,
            moveHistory: [...boardState.moveHistory, moveRecord],
            promotion: {
                active: false,
                position: null,
                color: null,
                pendingMove: null,
                tileRef: null
            }
        });
    };

    // Handle tile click (selecting a piece or making a move)
    const handleTileClick = (x: number, y: number) => {
        const { pieces, selectedTile, currentPlayer, promotion, checkmate } = boardState;

        // If promotion is active or game is in checkmate, ignore clicks
        if (promotion.active || checkmate) return;

        const clickedPiece = pieces[y][x];

        // If no tile is currently selected
        if (!selectedTile) {
            // Select a piece if it belongs to current player
            if (clickedPiece && clickedPiece.color === currentPlayer) {
                const possibleMoves = calculateLegalMoves(x, y, pieces, boardState);
                setBoardState({
                    ...boardState,
                    selectedTile: { x, y },
                    possibleMoves
                });
            }
        }
        // If a tile is already selected
        else {
            // Deselect if clicking the same tile
            if (selectedTile.x === x && selectedTile.y === y) {
                setBoardState({
                    ...boardState,
                    selectedTile: null,
                    possibleMoves: []
                });
            }
            // Check if the clicked tile is a possible move
            else if (isMoveInPossibleMoves(x, y, boardState.possibleMoves)) {
                // Execute the move
                executeMove(selectedTile.x, selectedTile.y, x, y);
            }
            // If clicking another piece of the current player, select it instead
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

    // Execute a move from one tile to another
    const executeMove = (fromX: number, fromY: number, toX: number, toY: number) => {
        const { pieces, currentPlayer, kings, enPassantTarget } = boardState;
        const movingPiece = pieces[fromY][fromX]!;
        const isKingMove = movingPiece.type === 'king';
        const isPawnMove = movingPiece.type === 'pawn';

        // Check for pawn promotion
        if (isPawnMove && shouldPromotePawn(movingPiece, toY)) {
            // Get reference to the tile element for positioning the promotion dialog
            const tileElement = document.querySelector(
                `[data-position="${String.fromCharCode(97 + toX)}${8 - toY}"]`
            ) as HTMLElement;

            // Show promotion dialog
            setBoardState({
                ...boardState,
                promotion: {
                    active: true,
                    position: { x: toX, y: toY },
                    color: movingPiece.color,
                    pendingMove: {
                        from: { x: fromX, y: fromY },
                        to: { x: toX, y: toY }
                    },
                    tileRef: tileElement || null
                }
            });
            return;
        }

        // Prepare new board state
        const newPieces = clonePieces(pieces);

        // Record move in history
        const moveRecord = {
            piece: {...movingPiece},
            from: { x: fromX, y: fromY },
            to: { x: toX, y: toY }
        };

        // Handle en passant capture
        let isEnPassant = false;
        if (isPawnMove && toX !== fromX && !pieces[toY][toX] && enPassantTarget) {
            isEnPassant = enPassantTarget.x === toX && enPassantTarget.y === toY;

            if (isEnPassant) {
                // Remove the captured pawn
                const capturedPawnY = currentPlayer === 'white' ? toY + 1 : toY - 1;
                newPieces[capturedPawnY][toX] = null;
            }
        }

        // Execute the standard move
        newPieces[toY][toX] = newPieces[fromY][fromX];
        newPieces[fromY][fromX] = null;

        // Update king position if king moved
        const newKings = {...kings};
        if (isKingMove) {
            newKings[currentPlayer] = { x: toX, y: toY };
        }

        // Set en passant target if pawn moved two squares
        let newEnPassantTarget = null;
        if (isPawnMove && Math.abs(fromY - toY) === 2) {
            const enPassantY = fromY + (currentPlayer === 'white' ? -1 : 1);
            newEnPassantTarget = { x: fromX, y: enPassantY };
        }

        // Change player
        const nextPlayer = getNextPlayer(currentPlayer);

        // Check for check/checkmate conditions
        const { check, checkmate } = getCheckStatus(
            newPieces,
            newKings,
            nextPlayer,
            {
                ...boardState,
                pieces: newPieces,
                kings: newKings,
                currentPlayer: nextPlayer,
                enPassantTarget: newEnPassantTarget
            }
        );

        // Update board state
        setBoardState({
            pieces: newPieces,
            selectedTile: null,
            possibleMoves: [],
            currentPlayer: nextPlayer,
            kings: newKings,
            check,
            checkmate,
            enPassantTarget: newEnPassantTarget,
            moveHistory: [...boardState.moveHistory, moveRecord],
            promotion: {
                active: false,
                position: null,
                color: null,
                pendingMove: null,
                tileRef: null
            }
        });
    };

    return {
        handleTileClick,
        handlePromotion,
        isMoveInPossibleMoves
    };
};