import { Player, User } from "@prisma/client";

export type PlayerInUser = Player & {user: User}
