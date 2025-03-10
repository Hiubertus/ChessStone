export const isMoveInPossibleMoves = (
    x: number,
    y: number,
    possibleMoves: { x: number, y: number }[]
): boolean => {
    return possibleMoves.some(move => move.x === x && move.y === y);
};