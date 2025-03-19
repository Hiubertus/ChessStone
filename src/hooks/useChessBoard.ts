import {useState} from "react";
import {BoardState} from "@/types/BoardState";
import {initializeBoard} from "@/utils/BoardUtilities/initializeBoard.ts";
import {BoardConfig} from "@/types/BoardConfig.ts";

export const useChessBoard = (config: BoardConfig) => {
    const initialPieces = initializeBoard(config);

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
        boardLayout: config.allowedPositions
    };

    const [boardState, setBoardState] = useState<BoardState>(initialState);

    return { boardState, setBoardState };
};

