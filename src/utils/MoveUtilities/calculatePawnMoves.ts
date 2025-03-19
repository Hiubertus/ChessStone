import {isValidPosition} from "@/utils/BoardUtilities/isValidPosition.ts";
import {ChessPiece} from "@/types/ChessPiece.ts";
import {Color} from "@/enums/Color.ts";
import {Position} from "@/types/Position.ts";
import {MoveHistory} from "@/types/MoveHistory.ts";
import {getEnPassantTarget} from "@/utils/MoveUtilities/getEnPassantTarget.ts";
import {Direction} from "@/types/Direction.ts";
import {PlayerConfig} from "@/types/BoardConfig.ts";

export const calculatePawnMoves = (
    x: number,
    y: number,
    pieces: (ChessPiece | null)[][],
    color: Color,
    moveHistory: MoveHistory[],
    players: PlayerConfig[]
): Position[] => {
    const possibleMoves: Position[] = [];
    const piece = pieces[y][x]!;
    const enPassantTarget = getEnPassantTarget(moveHistory, players);

    const playerConfig = players.find(player => player.color === color);
    if (!playerConfig) return possibleMoves;

    const direction = playerConfig.pawnDirection;

    const newY = y + direction.dy;
    const newX = x + direction.dx;

    if (isValidPosition(newX, newY) && !pieces[newY][newX]) {
        possibleMoves.push({ x: newX, y: newY });

        // Double move for first pawn move
        if (!piece.hasMoved) {
            const doubleY = y + (direction.dy * 2);
            const doubleX = x + (direction.dx * 2);

            if (isValidPosition(doubleX, doubleY) && !pieces[doubleY][doubleX]) {
                possibleMoves.push({ x: doubleX, y: doubleY });
            }
        }
    }

    const captureDirections = getCaptureDirections(direction);

    for (const captureDir of captureDirections) {
        const captureX = x + captureDir.dx;
        const captureY = y + captureDir.dy;

        if (isValidPosition(captureX, captureY)) {
            const targetPiece = pieces[captureY][captureX];
            if (targetPiece && targetPiece.color !== color) {
                possibleMoves.push({ x: captureX, y: captureY });
            }
            else if (
                !targetPiece &&
                enPassantTarget &&
                enPassantTarget.x === captureX &&
                enPassantTarget.y === captureY
            ) {
                possibleMoves.push({ x: captureX, y: captureY });
            }
        }
    }

    return possibleMoves;
};

const getCaptureDirections = (moveDirection: Direction): Direction[] => {
    const captureDirections: Direction[] = [];

    if (moveDirection.dy === -1 && moveDirection.dx === 0) {
        captureDirections.push({ dx: -1, dy: -1 });
        captureDirections.push({ dx: 1, dy: -1 });
    }

    else if (moveDirection.dy === 1 && moveDirection.dx === 0) {
        captureDirections.push({ dx: -1, dy: 1 });
        captureDirections.push({ dx: 1, dy: 1 });
    }

    else if (moveDirection.dy === 0 && moveDirection.dx === -1) {
        captureDirections.push({ dx: -1, dy: -1 });
        captureDirections.push({ dx: -1, dy: 1 });
    }

    else if (moveDirection.dy === 0 && moveDirection.dx === 1) {
        captureDirections.push({ dx: 1, dy: -1 });
        captureDirections.push({ dx: 1, dy: 1 });
    }

    else {
        const orthogonal1: Direction = { dx: moveDirection.dy, dy: moveDirection.dx };
        const orthogonal2: Direction = { dx: -moveDirection.dy, dy: -moveDirection.dx };
        captureDirections.push(orthogonal1);
        captureDirections.push(orthogonal2);
    }

    return captureDirections;
};