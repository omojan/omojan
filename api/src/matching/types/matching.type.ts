import { Game, Matching, Rule, User } from '@prisma/client';

export type MatchingIdResponse = {
  matchingId: string;
};
export type IdType = string;
export type MatchingInPlayers = Matching & { players: User[]; hostUser: User };
export type MatchingInPlayersAndRule = Matching & {
  players: User[];
  hostUser: User;
  rule: Rule;
};
export type MatchingInPlayersAndGame = Matching & { players: User[]; game: Game };

// export type MatchingInPlayersAndRuleAndGame = Matching & { players: User[]; hostUser: User; rule: Rule; game: Game };
