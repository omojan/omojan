import { Player, Text, Turn } from "@prisma/client";

export type TurnInPlayerAndText = Turn & {
	player: Player;
	text: Text | null;
};
