import {Color} from "@/enums/Color.ts";

export const getNextPlayer = (currentPlayer: Color): Color => {
    return currentPlayer === Color.White ? Color.Black : Color.White;
};