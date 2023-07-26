import { Player, User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User & {
      player: Player;
    };
  }
}
declare module 'http' {
  interface IncomingHttpHeaders {
    user_id?: string;
  }
}
