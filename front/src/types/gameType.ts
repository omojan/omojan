import { Game, Matching, Player, Round, Rule, User, Word } from "@prisma/client";
import { PlayerInUserAndWords } from "./playerType";
import { RoundInOrderPlayersAndTurnsInPlayerAndText } from "./roundType";
// import { PlayerInUser } from "./playerType";

export type CandidacyWord = { word: string; position: "top" | "bottom" };

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
