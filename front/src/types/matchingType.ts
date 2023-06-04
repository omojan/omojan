import { Game, Matching, Rule, User } from "@prisma/client";

export type MatchingIdResponse = {
	matchingId: string;
};

export type MatchingOption = {
	name: string;
	timeLimit: number;
	playerCount: number;
	turnCount: number;
	isLock: boolean;
	password: string;
	errors: {
		name: boolean;
		password: boolean;
	};
};
// export type MatchingInPlayers = Matching & { players: User[]; hostUser: User };
export type MatchingInPlayersAndRule = Matching & { players: User[]; hostUser: User; rule: Rule };
export type MatchingInPlayersAndGame = Matching & { players: User[]; game: Game };

// export type MatchingInPlayersAndRuleAndGame = Matching & { players: User[]; hostUser: User; rule: Rule; game: Game };
