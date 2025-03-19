import {Color} from "@/enums/Color.ts";
import {PlayerConfig} from "@/types/BoardConfig.ts";

export const getNextPlayer = (currentPlayer: Color, players: PlayerConfig[]): Color => {
    const playerColors = players.map(player => player.color);
    const currentIndex = playerColors.indexOf(currentPlayer);

    if (currentIndex === -1) {
        return playerColors[0];
    }

    const nextIndex = (currentIndex + 1) % playerColors.length;
    return playerColors[nextIndex];
};