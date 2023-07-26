import { Game, Matching, Player, Rule } from '@prisma/client';
import { PlayerInUserAndWords } from './playerType';
import { RoundInOrderPlayersAndTurnsInPlayerAndText } from './roundType';

export type GameInPlayersAndRule = Game & {
  players: Player[];
  rule: Rule;
};

export type MountGame = Game & {
  rule: Rule;
  players: PlayerInUserAndWords[];
  rounds: RoundInOrderPlayersAndTurnsInPlayerAndText[];
  matching: Matching & {
    players: PlayerInUserAndWords[];
    hostPlayer: Player;
  };
};

// export type UpdateGame = Game & {
//   players: PlayerInUserAndWords[];
//   rounds: Round[];
// };
export type UpdateGameState = {
  mePlayer: PlayerInUserAndWords;
  game: Game & {
    players: PlayerInUserAndWords[];
    rounds: RoundInOrderPlayersAndTurnsInPlayerAndText[];
  };
};
