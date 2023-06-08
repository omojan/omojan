import { Game, Matching, Player, Rule } from '@prisma/client';
import { PlayerInUser } from './playerType';

export type MatchingIdResponse = {
  matchingId: string;
};

export type MatchingInUsersAndGame = Matching & {
  players: PlayerInUser[];
  game: Game;
};

export type MatchingInUsersAndHostAndRule = Matching & {
  players: PlayerInUser[];
  hostPlayer: Player;
  game: Game & {
    rule: Rule;
  };
};
