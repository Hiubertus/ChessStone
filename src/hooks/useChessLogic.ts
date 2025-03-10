import {ChessPiece} from "@/types/ChessPiece.ts";
import {BoardState} from "@/types/BoardState.ts";
import {Dispatch, SetStateAction} from "react";

export const useChessLogic = (boardState: BoardState, setBoardState: Dispatch<SetStateAction<BoardState>>) => {
    // Funkcja sprawdzająca czy pion powinien być promowany
    const shouldPromotePawn = (piece: ChessPiece, toY: number): boolean => {
        return piece.type === 'pawn' &&
            ((piece.color === 'white' && toY === 0) ||
                (piece.color === 'black' && toY === 7));
    };

    // Funkcja sprawdzająca, czy pozycja jest na szachownicy
    const isValidPosition = (x: number, y: number): boolean => {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    };

    // Funkcja sprawdzająca czy król jest szachowany
    const isKingInCheck = (kingX: number, kingY: number, kingColor: 'white' | 'black', pieces: (ChessPiece | null)[][]): boolean => {
        const opponentColor = kingColor === 'white' ? 'black' : 'white';

        // Sprawdź ataki pionków
        // WAŻNE: Kierunek ataku pionków jest PRZECIWNY do kierunku ruchu!
        const pawnDirection = kingColor === 'white' ? -1 : 1;

        for (const dx of [-1, 1]) {
            const checkX = kingX + dx;
            const checkY = kingY + pawnDirection;

            if (isValidPosition(checkX, checkY)) {
                const piece = pieces[checkY][checkX];
                if (piece && piece.type === 'pawn' && piece.color === opponentColor) {
                    return true;
                }
            }
        }

        const knightMoves = [
            { dx: 1, dy: 2 }, { dx: 2, dy: 1 },
            { dx: -1, dy: 2 }, { dx: -2, dy: 1 },
            { dx: 1, dy: -2 }, { dx: 2, dy: -1 },
            { dx: -1, dy: -2 }, { dx: -2, dy: -1 }
        ];

        for (const move of knightMoves) {
            const checkX = kingX + move.dx;
            const checkY = kingY + move.dy;

            if (isValidPosition(checkX, checkY)) {
                const piece = pieces[checkY][checkX];
                if (piece && piece.type === 'knight' && piece.color === opponentColor) {
                    return true;
                }
            }
        }

        // Sprawdź ataki po liniach i przekątnych (wieża, goniec, hetman, król)
        const directions = [
            // Pionowo i poziomo (wieża, hetman)
            { dx: 0, dy: 1, pieces: ['rook', 'queen'] },
            { dx: 0, dy: -1, pieces: ['rook', 'queen'] },
            { dx: 1, dy: 0, pieces: ['rook', 'queen'] },
            { dx: -1, dy: 0, pieces: ['rook', 'queen'] },

            // Przekątne (goniec, hetman)
            { dx: 1, dy: 1, pieces: ['bishop', 'queen'] },
            { dx: 1, dy: -1, pieces: ['bishop', 'queen'] },
            { dx: -1, dy: 1, pieces: ['bishop', 'queen'] },
            { dx: -1, dy: -1, pieces: ['bishop', 'queen'] }
        ];

        for (const dir of directions) {
            let checkX = kingX + dir.dx;
            let checkY = kingY + dir.dy;

            while (isValidPosition(checkX, checkY)) {
                const piece = pieces[checkY][checkX];

                if (piece) {
                    if (piece.color === opponentColor && dir.pieces.includes(piece.type as string)) {
                        return true;
                    }
                    break; // Zatrzymaj się po napotkaniu figury
                }

                checkX += dir.dx;
                checkY += dir.dy;
            }
        }

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;

                const checkX = kingX + dx;
                const checkY = kingY + dy;

                if (isValidPosition(checkX, checkY)) {
                    const piece = pieces[checkY][checkX];
                    if (piece && piece.type === 'king' && piece.color === opponentColor) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    // Funkcja obliczająca wszystkie możliwe ruchy figury, bez uwzględnienia szacha
    const calculatePossibleMoves = (
        x: number,
        y: number,
        pieces: (ChessPiece | null)[][],
        currentBoardState: BoardState
    ): { x: number, y: number }[] => {
        const piece = pieces[y][x];
        if (!piece) return [];

        const possibleMoves: { x: number, y: number }[] = [];
        const { color, type } = piece;
        const { enPassantTarget } = currentBoardState;

        switch (type) {
            case 'pawn': {
                const direction = color === 'white' ? -1 : 1;
                const startRow = color === 'white' ? 6 : 1;

                // Ruch do przodu o jedno pole
                if (isValidPosition(x, y + direction) && !pieces[y + direction][x]) {
                    possibleMoves.push({ x, y: y + direction });

                    // Ruch do przodu o dwa pola z pozycji startowej
                    if (y === startRow && !pieces[y + 2 * direction][x]) {
                        possibleMoves.push({ x, y: y + 2 * direction });
                    }
                }

                // Bicie na ukos
                for (const dx of [-1, 1]) {
                    const newX = x + dx;
                    const newY = y + direction;

                    if (isValidPosition(newX, newY)) {
                        // Standardowe bicie
                        const targetPiece = pieces[newY][newX];
                        if (targetPiece && targetPiece.color !== color) {
                            possibleMoves.push({ x: newX, y: newY });
                        }
                        // Bicie en passant
                        else if (!targetPiece &&
                            enPassantTarget &&
                            enPassantTarget.x === newX &&
                            enPassantTarget.y === newY) {
                            possibleMoves.push({ x: newX, y: newY });
                        }
                    }
                }
                break;
            }

            case 'knight': {
                const knightMoves = [
                    { dx: 1, dy: 2 }, { dx: 2, dy: 1 },
                    { dx: -1, dy: 2 }, { dx: -2, dy: 1 },
                    { dx: 1, dy: -2 }, { dx: 2, dy: -1 },
                    { dx: -1, dy: -2 }, { dx: -2, dy: -1 }
                ];

                for (const move of knightMoves) {
                    const newX = x + move.dx;
                    const newY = y + move.dy;

                    if (isValidPosition(newX, newY)) {
                        const targetPiece = pieces[newY][newX];
                        if (!targetPiece || targetPiece.color !== color) {
                            possibleMoves.push({ x: newX, y: newY });
                        }
                    }
                }
                break;
            }

            case 'bishop': {
                const bishopDirections = [
                    { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
                    { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
                ];

                for (const dir of bishopDirections) {
                    let newX = x + dir.dx;
                    let newY = y + dir.dy;

                    while (isValidPosition(newX, newY)) {
                        const targetPiece = pieces[newY][newX];
                        if (!targetPiece) {
                            possibleMoves.push({ x: newX, y: newY });
                        } else {
                            if (targetPiece.color !== color) {
                                possibleMoves.push({ x: newX, y: newY });
                            }
                            break; // Zatrzymaj się po napotkaniu figury
                        }
                        newX += dir.dx;
                        newY += dir.dy;
                    }
                }
                break;
            }

            case 'rook': {
                const rookDirections = [
                    { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
                    { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
                ];

                for (const dir of rookDirections) {
                    let newX = x + dir.dx;
                    let newY = y + dir.dy;

                    while (isValidPosition(newX, newY)) {
                        const targetPiece = pieces[newY][newX];
                        if (!targetPiece) {
                            possibleMoves.push({ x: newX, y: newY });
                        } else {
                            if (targetPiece.color !== color) {
                                possibleMoves.push({ x: newX, y: newY });
                            }
                            break; // Zatrzymaj się po napotkaniu figury
                        }
                        newX += dir.dx;
                        newY += dir.dy;
                    }
                }
                break;
            }

            case 'queen': {
                const queenDirections = [
                    { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
                    { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
                    { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
                    { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
                ];

                for (const dir of queenDirections) {
                    let newX = x + dir.dx;
                    let newY = y + dir.dy;

                    while (isValidPosition(newX, newY)) {
                        const targetPiece = pieces[newY][newX];
                        if (!targetPiece) {
                            possibleMoves.push({ x: newX, y: newY });
                        } else {
                            if (targetPiece.color !== color) {
                                possibleMoves.push({ x: newX, y: newY });
                            }
                            break; // Zatrzymaj się po napotkaniu figury
                        }
                        newX += dir.dx;
                        newY += dir.dy;
                    }
                }
                break;
            }

            case 'king': {
                // Wszystkie sąsiednie pola
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;

                        const newX = x + dx;
                        const newY = y + dy;

                        if (isValidPosition(newX, newY)) {
                            const targetPiece = pieces[newY][newX];
                            if (!targetPiece || targetPiece.color !== color) {
                                possibleMoves.push({ x: newX, y: newY });
                            }
                        }
                    }
                }
                break;
            }
        }

        return possibleMoves;
    };

    // Funkcja sprawdzająca, czy ruch jest legalny, uwzględniająca szachy
    const calculateLegalMoves = (
        x: number,
        y: number,
        pieces: (ChessPiece | null)[][],
        currentBoardState: BoardState
    ): { x: number, y: number }[] => {
        const piece = pieces[y][x];
        if (!piece) return [];

        const { kings } = currentBoardState;
        const possibleMoves = calculatePossibleMoves(x, y, pieces, currentBoardState);
        const legalMoves: { x: number, y: number }[] = [];

        // Dla każdego możliwego ruchu sprawdź, czy nie pozostawia króla w szachu
        for (const move of possibleMoves) {
            // Wykonaj ruch na tymczasowej kopii planszy
            const newPieces = pieces.map(row => [...row]);
            newPieces[move.y][move.x] = newPieces[y][x];
            newPieces[y][x] = null;

            // Sprawdź czy król nie jest szachowany po ruchu
            const kingPos = piece.type === 'king'
                ? { x: move.x, y: move.y }
                : kings[piece.color];

            if (!isKingInCheck(kingPos.x, kingPos.y, piece.color, newPieces)) {
                legalMoves.push(move);
            }
        }

        return legalMoves;
    };

    // Pomocnicza funkcja do sprawdzania, czy dany ruch jest w liście możliwych ruchów
    const isMoveInPossibleMoves = (x: number, y: number, possibleMoves: { x: number, y: number }[]): boolean => {
        return possibleMoves.some(move => move.x === x && move.y === y);
    };

    // Funkcja sprawdzająca, czy gracz ma jeszcze jakieś legalne ruchy
    const playerHasLegalMoves = (
        player: 'white' | 'black',
        pieces: (ChessPiece | null)[][],
        currentBoardState: BoardState
    ): boolean => {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = pieces[y][x];
                if (piece && piece.color === player) {
                    const legalMoves = calculateLegalMoves(x, y, pieces, currentBoardState);
                    if (legalMoves.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // Funkcja obsługująca promocję pionka
    const handlePromotion = (pieceType: ChessPiece['type']) => {
        const { promotion, pieces, currentPlayer, kings } = boardState;

        if (!promotion.pendingMove || !promotion.position || !promotion.color) return;

        const { from, to } = promotion.pendingMove;
        const newPieces = [...pieces.map(row => [...row])];

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
        const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';

        // Check for check/checkmate conditions
        const whiteInCheck = isKingInCheck(kings.white.x, kings.white.y, 'white', newPieces);
        const blackInCheck = isKingInCheck(kings.black.x, kings.black.y, 'black', newPieces);

        let check: 'white' | 'black' | null = null;
        if (whiteInCheck) check = 'white';
        if (blackInCheck) check = 'black';

        // Check for checkmate
        let checkmate: 'white' | 'black' | null = null;
        if (check === nextPlayer) {
            const hasLegalMoves = playerHasLegalMoves(nextPlayer, newPieces, {
                ...boardState,
                pieces: newPieces,
                currentPlayer: nextPlayer,
                check,
                promotion: { active: false, position: null, color: null, pendingMove: null, tileRef: null }
            });

            if (!hasLegalMoves) {
                checkmate = nextPlayer;
            }
        }

        // Record the move in history
        const moveRecord = {
            piece: {
                id: id,
                type: pieceType,
                color: promotion.color
            },
            from: from,
            to: to
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

    // Funkcja obsługująca kliknięcie na pole
    const handleTileClick = (x: number, y: number) => {
        const { pieces, selectedTile, currentPlayer, kings, enPassantTarget, promotion } = boardState;

        // If promotion is active, ignore clicks
        if (promotion.active) {
            return;
        }

        const clickedPiece = pieces[y][x];

        // Jeśli gra zakończona szachmatem, nie pozwalaj na ruchy
        if (boardState.checkmate) {
            return;
        }

        // Jeśli nie wybrano wcześniej pola
        if (!selectedTile) {
            // Sprawdź czy na polu jest figura i czy należy do aktualnego gracza
            if (clickedPiece && clickedPiece.color === currentPlayer) {
                // Wybierz pole i oblicz możliwe ruchy
                const possibleMoves = calculateLegalMoves(x, y, pieces, boardState);
                setBoardState({
                    ...boardState,
                    selectedTile: { x, y },
                    possibleMoves
                });
            }
        }
        // Jeśli już wybrano pole
        else {
            // Sprawdź czy kliknięte pole jest tym samym polem (odznaczenie)
            if (selectedTile.x === x && selectedTile.y === y) {
                setBoardState({
                    ...boardState,
                    selectedTile: null,
                    possibleMoves: []
                });
            }
            // Sprawdź czy kliknięte pole jest możliwym ruchem
            else if (isMoveInPossibleMoves(x, y, boardState.possibleMoves)) {
                // Przygotuj nowy stan
                const newPieces = [...pieces.map(row => [...row])];
                const movingPiece = newPieces[selectedTile.y][selectedTile.x]!;
                const isKingMove = movingPiece.type === 'king';
                const isPawnMove = movingPiece.type === 'pawn';

                // Check for pawn promotion
                if (isPawnMove && shouldPromotePawn(movingPiece, y)) {
                    // Get reference to the tile element
                    const tileElement = document.querySelector(`[data-position="${String.fromCharCode(97 + x)}${8 - y}"]`) as HTMLElement;

                    // Activate promotion dialog instead of completing the move
                    setBoardState({
                        ...boardState,
                        promotion: {
                            active: true,
                            position: { x, y },
                            color: movingPiece.color,
                            pendingMove: {
                                from: { x: selectedTile.x, y: selectedTile.y },
                                to: { x, y }
                            },
                            tileRef: tileElement || null
                        }
                    });
                    return;
                }

                // Zapamiętaj ruch w historii
                const moveRecord = {
                    piece: {...movingPiece},
                    from: { x: selectedTile.x, y: selectedTile.y },
                    to: { x, y }
                };

                // Sprawdź czy to bicie en passant
                let isEnPassant = false;
                if (isPawnMove && x !== selectedTile.x && !pieces[y][x] && enPassantTarget !== null) {
                    isEnPassant = enPassantTarget.x === x && enPassantTarget.y === y;

                    if (isEnPassant) {
                        // Usuń zbitego pionka
                        const capturedPawnY = currentPlayer === 'white' ? y + 1 : y - 1;
                        newPieces[capturedPawnY][x] = null;
                    }
                }

                // Wykonaj standardowy ruch
                newPieces[y][x] = newPieces[selectedTile.y][selectedTile.x];
                newPieces[selectedTile.y][selectedTile.x] = null;

                // Zaktualizuj pozycję króla jeśli to król wykonał ruch
                const newKings = {...kings};
                if (isKingMove) {
                    newKings[currentPlayer] = { x, y };
                }

                // Sprawdź czy należy ustawić cel dla en passant
                let newEnPassantTarget = null;
                if (isPawnMove && Math.abs(selectedTile.y - y) === 2) {
                    // Pionek wykonał ruch o dwa pola, więc ustaw cel en passant
                    const enPassantY = selectedTile.y + (currentPlayer === 'white' ? -1 : 1);
                    newEnPassantTarget = { x: selectedTile.x, y: enPassantY };
                }

                // Zmień gracza
                const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';

                // Sprawdź czy któryś król jest szachowany po ruchu
                const whiteInCheck = isKingInCheck(newKings.white.x, newKings.white.y, 'white', newPieces);
                const blackInCheck = isKingInCheck(newKings.black.x, newKings.black.y, 'black', newPieces);

                let check: 'white' | 'black' | null = null;
                if (whiteInCheck) check = 'white';
                if (blackInCheck) check = 'black';

                // Sprawdź czy to szach mat
                let checkmate: 'white' | 'black' | null = null;
                if (check === nextPlayer) {
                    const hasLegalMoves = playerHasLegalMoves(nextPlayer, newPieces, {
                        ...boardState,
                        pieces: newPieces,
                        kings: newKings,
                        check,
                        currentPlayer: nextPlayer,
                        enPassantTarget: newEnPassantTarget
                    });

                    if (!hasLegalMoves) {
                        checkmate = nextPlayer;
                    }
                }

                // Aktualizuj stan gry
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

    return {
        shouldPromotePawn,
        isValidPosition,
        isKingInCheck,
        calculatePossibleMoves,
        calculateLegalMoves,
        isMoveInPossibleMoves,
        playerHasLegalMoves,
        handlePromotion,
        handleTileClick
    };
};