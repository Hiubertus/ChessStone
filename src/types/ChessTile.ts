import { ChessPiece } from "@/types/ChessPiece";

export type ChessTile = {
    position: {
        x: number;
        y: number;
    };
    isLight: boolean;
    piece: ChessPiece | null;
    isSelected: boolean;
    isPossibleMove: boolean;
    isCheck?: boolean;
    isLastMoveFrom?: boolean;
    isLastMoveTo?: boolean;
    onClick: () => void;
}