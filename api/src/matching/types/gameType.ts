import { Game, Matching, Rule } from '@prisma/client';
import { PlayerInUser } from './playerType';

export type GameInMatchingUsersAndHost = Game & {
    rule: Rule;
    matching: Matching & {
        players: PlayerInUser[];
        hostPlayer: PlayerInUser;
    }
};
