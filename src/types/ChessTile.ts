import { ChessPiece } from "@/types/ChessPiece";
import {Position} from "@/types/Position.ts";

export type ChessTile = {
    position: Position;
    isLight: boolean;
    piece: ChessPiece | null;
    isSelected: boolean;
    isPossibleMove: boolean;
    isCheck?: boolean;
    isLastMoveFrom?: boolean;
    isLastMoveTo?: boolean;
    onClick: () => void;
}