import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { decode } from 'next-auth/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token =
      req.cookies['next-auth.session-token'] ??
      req.headers.authorization.split(' ')[1];
    if (!token) {
      return false;
    }

    const secret = this.configService.get('NEXTAUTH_SECRET');
    if (!secret) {
      return false;
    }
    // console.log('token',token);
    // console.log('secret',secret);

    try {
      const decodeResult = await decode({ token, secret });

      if (!decodeResult) {
        return false;
      }

      const user = await this.prismaService.user.findUnique({
        where: {
          id: decodeResult.sub,
        },
        include: { player: true },
      });
      // console.log('user',user);
      if (!user) {
        return false;
      }

      req.user = user;
      return true;
    } catch (error) {
      console.error('error', error);
      return false;
    }
  }
}
