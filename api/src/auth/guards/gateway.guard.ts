import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decode } from 'next-auth/jwt';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GatewayGuard implements CanActivate {
  constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
  const client: Socket = context.switchToWs().getClient()
  const token = client.handshake.headers.cookie
  .split('; ')
  .find((cookie: string) => cookie.startsWith('next-auth.session-token'))
  .split('=')[1];

  if (!token) {
    return false;
  }
  const secret = this.configService.get('NEXTAUTH_SECRET');
  if (!secret) {
    return false;
  }

  try {
    const decodeResult = await decode({ token, secret });
    if (!decodeResult) {
      return false;
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: decodeResult.sub,
      },
    });
    if (!user) {
      return false;
    }
    client.handshake.headers.user_id = user.id
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
}
