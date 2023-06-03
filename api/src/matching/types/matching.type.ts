import { Matching, Rule, User } from "@prisma/client";

export type MatchingIdResponseType = {
	matchingId: string;
};
export type IdType = string
export type MatchingInPlayers = Matching & { players: User[]; hostUser: User };
export type MatchingInPlayersAndRule = Matching & { players: User[]; hostUser: User; rule: Rule };
