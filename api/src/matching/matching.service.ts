import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { MatchingIdResponseType } from './types/matching.type';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Matching, User } from '@prisma/client';
import { Observable, concatMap, interval, map } from 'rxjs';
import { MessageType } from './types/util.type';
import { decode } from 'next-auth/jwt';

@Injectable()
export class MatchingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  observableFindAll(): Observable<MessageEvent<Matching[]>> {
    return interval(1000)
      .pipe(concatMap(() => this.prismaService.matching.findMany()))
      .pipe(map((matchings) => ({ data: matchings } as MessageEvent)));
  }
  observableFindPlayers(token: string): Observable<MessageEvent<User[]>> {
    return interval(1000)
      .pipe(
        concatMap(() =>
          decode({
            token,
            secret: this.configService.get('NEXTAUTH_SECRET'),
          }),
        ),
      )
      .pipe(
        concatMap((decodeUser) =>
          this.prismaService.user.findUnique({
            where: { id: decodeUser.sub },
          }),
        ),
      )
      .pipe(
        concatMap(
          (user) =>
            this.prismaService.matching.findUnique({
              where: {
                id: user.joinMatchingId,
              },
              include: {
                players: true,
              },
            }),
          // .catch((error) => {
          //   if (
          //     error instanceof PrismaClientUnknownRequestError &&
          //     error.code === 'P2025'
          //   ) {
          //     // テーブルが見つからなかった場合のエラー処理
          //     return new Error('Table not found');
          //   }
          //   throw error;
          // }),
        ),
      )
      .pipe(map((users) => ({ data: users.players } as MessageEvent)));
  }

  async create(
    userId: string,
    dto: CreateMatchingDto,
  ): Promise<MatchingIdResponseType> {
    const matching = await this.prismaService.matching.create({
      data: {
        name: dto.name,
        password: dto.password,
        hostUser: {
          connect: {
            id:userId
          }
        },
        rule: {
          create: {
            timeLimit: dto.timeLimit,
            playerCount: dto.turnCount,
            turnCount: dto.turnCount,
          }
        },
        players: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return { matchingId: matching.id };
  }

  findAll(): Promise<Matching[]> {
    return this.prismaService.matching.findMany();
  }

  findOne(id: string): Promise<Matching> {
    return this.prismaService.matching.findUnique({
      where: {
        id: id,
      },
    });
  }

  async join(id: string, userId: string): Promise<MessageType> {
    const matching = await this.prismaService.matching.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
        rule: true
      },
    });
    if (matching.players.length >= matching.rule.playerCount) {
      throw new BadRequestException('The matching is already full.');
    }

    await this.prismaService.matching.update({
      where: {
        id,
      },
      data: {
        players: {
          connect: [
            {
              id: userId,
            },
          ],
        },
      },
    });
    return { message: 'ok' };
  }

  async exit(id: string, userId: string): Promise<MessageType> {
    await this.prismaService.matching.update({
      where: {
        id,
      },
      data: {
        players: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    return { message: 'ok' };
  }

  async closeMatching(id: string): Promise<MessageType> {
    await this.prismaService.matching.update({
      where: {
        id,
      },
      data: {
        isRecruiting: false,
      },
    });
    return { message: 'ok' };
  }
  async remove(id: string): Promise<MessageType> {
    await this.prismaService.matching.delete({
      where: {
        id,
      },
    });
    return { message: 'ok' };
  }
}
