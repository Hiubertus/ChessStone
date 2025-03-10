import {ChessPiece} from "@/types/ChessPiece.ts";

export type BoardState = {
    pieces: (ChessPiece | null)[][];
    selectedTile: { x: number, y: number } | null;
    possibleMoves: { x: number, y: number }[];
    currentPlayer: 'white' | 'black';
    kings: {
        white: { x: number, y: number };
        black: { x: number, y: number };
    };
    check: 'white' | 'black' | null;
    checkmate: 'white' | 'black' | null;
    enPassantTarget: { x: number, y: number } | null;
    moveHistory: {
        piece: ChessPiece;
        from: { x: number, y: number };
        to: { x: number, y: number };
    }[];
    promotion: {
        active: boolean;
        position: { x: number, y: number } | null;
        color: 'white' | 'black' | null;
        pendingMove: {
            from: { x: number, y: number },
            to: { x: number, y: number }
        } | null;
        tileRef: HTMLElement | null;
    };
};