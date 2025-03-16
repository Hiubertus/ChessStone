import {Position} from "@/types/Position.ts";

export const isMoveInPossibleMoves = (
    x: number,
    y: number,
    possibleMoves: Position[]
): boolean => {
    return possibleMoves.some(move => move.x === x && move.y === y);
};