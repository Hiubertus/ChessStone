import { Color } from '@/enums';
import { PlayerConfig } from '@/types';

type Props = {
  currentPlayer: Color;
  players: PlayerConfig[];
};

export const getNextPlayer = ({ currentPlayer, players }: Props): Color => {
  const playerColors = players.map(player => player.color);
  const currentIndex = playerColors.indexOf(currentPlayer);

  if (currentIndex === -1) {
    return playerColors[0];
  }

  const nextIndex = (currentIndex + 1) % playerColors.length;
  return playerColors[nextIndex];
};
