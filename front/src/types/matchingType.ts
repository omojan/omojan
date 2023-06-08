import { Game, Matching, Player, Rule, User } from "@prisma/client";
import { PlayerInUser } from "./playerType";
export type MatchingIdResponse = {
	matchingId: string;
};

export type MatchingOption = {
	name: string;
	timeLimit: number;
	playerCount: number;
	roundCount: number;
	frontAndBack: boolean;
	isLock: boolean;
	password: string;
	errors: {
		name: boolean;
		password: boolean;
	};
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
