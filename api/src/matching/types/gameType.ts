import { Game, Matching, Rule, User } from '@prisma/client';

export type GameInMtchingInRule = Game & {
  matching: Matching & {
    rule: Rule;
    players: User[];
    hostUser: User;
  };
};
