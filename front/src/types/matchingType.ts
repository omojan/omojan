import { Matching, Rule, User } from "@prisma/client";

export type MatchingIdResponseType = {
	matchingId: string;
};

export type MatchingOptionType = {
	name: string;
	timeLimit: number;
	playerCount: number;
	turnCount: number;
	isLock: boolean;
	password: string;
	error: boolean;
};
export type MatchingInPlayers = Matching & { players: User[]; hostUser: User };
export type MatchingInPlayersAndRule = Matching & { players: User[]; hostUser: User; rule: Rule };
