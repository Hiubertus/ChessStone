
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
        const { pieces, currentPlayer, kings, enPassantTarget } = boardState;
        const movingPiece = pieces[fromY][fromX]!;
        const isKingMove = movingPiece.type === 'king';
        const isPawnMove = movingPiece.type === 'pawn';

        if (isPawnMove && shouldPromotePawn(movingPiece, toY)) {
            const tileElement = document.querySelector(
                `[data-position="${String.fromCharCode(97 + toX)}${8 - toY}"]`
            ) as HTMLElement;

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

        const newPieces = clonePieces(pieces);

        if (newPieces[fromY][fromX]) {
            newPieces[fromY][fromX]!.hasMoved = true;
        }

        const moveRecord = {
            piece: {...movingPiece},
            from: { x: fromX, y: fromY },
            to: { x: toX, y: toY }
        };

        let isEnPassant = false;
        if (isPawnMove && toX !== fromX && !pieces[toY][toX] && enPassantTarget) {
            isEnPassant = enPassantTarget.x === toX && enPassantTarget.y === toY;

            if (isEnPassant) {
                const capturedPawnY = currentPlayer === 'white' ? toY + 1 : toY - 1;
                newPieces[capturedPawnY][toX] = null;
            }
        }

        newPieces[toY][toX] = newPieces[fromY][fromX];
        newPieces[fromY][fromX] = null;


        const newKings = {...kings};

        if (isKingMove) {
            const isCastling = Math.abs(fromX - toX) === 2;

            if (isCastling) {
                const backRank = currentPlayer === 'white' ? 7 : 0;

                if (toX > fromX) {
                    const rookPiece = newPieces[backRank][7];
                    newPieces[backRank][5] = rookPiece;
                    newPieces[backRank][7] = null;
                    if (rookPiece) rookPiece.hasMoved = true;
                } else {
                    const rookPiece = newPieces[backRank][0];
                    newPieces[backRank][3] = rookPiece;
                    newPieces[backRank][0] = null;
                    if (rookPiece) rookPiece.hasMoved = true;
                }
            }

            newKings[currentPlayer] = { x: toX, y: toY };
        }

        let newEnPassantTarget = null;
        if (isPawnMove && Math.abs(fromY - toY) === 2) {
            const enPassantY = fromY + (currentPlayer === 'white' ? -1 : 1);
            newEnPassantTarget = { x: fromX, y: enPassantY };
        }

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
                enPassantTarget: newEnPassantTarget
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
            enPassantTarget: newEnPassantTarget,
            moveHistory: [...boardState.moveHistory, moveRecord],
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