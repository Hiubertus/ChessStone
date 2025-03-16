import {ChessPiece} from "@/types/ChessPiece.ts";
import {Color} from "@/enums/Color.ts";
import {Position} from "@/types/Position.ts";

export type BoardState = {
    pieces: (ChessPiece | null)[][];
    selectedTile: Position | null;
    possibleMoves: Position[];
    currentPlayer: Color;
    kings: Record<Color, Position>;
    check: Color | null;
    checkmate: Color | null;
    enPassantTarget: Position | null;
    moveHistory: {
        piece: ChessPiece;
        from: Position;
        to: Position;
    }[];
    lastMove: {
        from: Position | null;
        to: Position | null;
    };
    promotion: {
        active: boolean;
        position: Position | null;
        color: Color | null;
        pendingMove: {
            from: Position,
            to: Position
        } | null;
        tileRef: HTMLElement | null;
    };
};