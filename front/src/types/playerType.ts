import { Player, User } from "@prisma/client";

export type PlayerInUser = Player & {user: User}

export type PlayerInUserAndWords = Player & {
	user: User;
	words: string[];
};