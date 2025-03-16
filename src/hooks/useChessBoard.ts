import {useState} from "react";
import {BoardState} from "@/types/BoardState";
import {Color} from "@/enums/Color.ts";
import {initializeBoard} from "@/utils/BoardUtilities/initializeBoard.ts";

export const useChessBoard = () => {
    const initialPieces = initializeBoard();
    const initialState: BoardState = {
        pieces: initialPieces,
        selectedTile: null,
        possibleMoves: [],
        currentPlayer: Color.White,
        kings: {
            [Color.White]: { x: 4, y: 7 },
            [Color.Black]: { x: 4, y: 0 }
        },
        check: null,
        checkmate: null,
        moveHistory: [],
        lastMove: {
            from: null,
            to: null
        },
        promotion: {
            active: false,
            position: null,
            color: null,
            pendingMove: null,
        }
    };

    const [boardState, setBoardState] = useState<BoardState>(initialState);

    return { boardState, setBoardState };
};

