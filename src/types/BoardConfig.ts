import { Color } from "@/enums/Color.ts";
import { Position } from "@/types/Position.ts";
import { ChessPiece } from "@/types/ChessPiece.ts";
import { Direction } from "@/types/Direction.ts";

export type PlayerConfig = {
    color: Color;
    pawnDirection: Direction;
};

export type BoardConfig = {
    allowedPositions: Position[];
    initialPieces: ChessPiece[];
    players: PlayerConfig[];
};