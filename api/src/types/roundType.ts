import { Player, Round } from '@prisma/client';
import { TurnInPlayerAndText } from './turnType';
import { PlayerInUser } from './playerType';

export type RoundInOrderPlayersAndTurnsInPlayerAndText = Round & {
  // orderPlayers: Player[];
  orderPlayers: PlayerInUser[];
  turns: TurnInPlayerAndText[];
};
