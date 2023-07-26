import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import {
  MatchingIdResponse,
  MatchingInUsersAndGame,
  MatchingInUsersAndHostAndRule,
} from '../types/matching.type';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Observable, concatMap, interval, map } from 'rxjs';
import { MessageType } from '../types/util.type';

@Injectable()
export class MatchingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
  logger = new Logger();

  observableFindAll(): Observable<
    MessageEvent<MatchingInUsersAndHostAndRule[]>
  > {
    return interval(1500)
      .pipe(
        concatMap(() =>
          this.prismaService.matching.findMany({
            include: {
              players: { include: { user: true } },
              hostPlayer: true,
              game: { include: { rule: true } },
            },
          }),
        ),
      )
      .pipe(map((matchings) => ({ data: matchings } as MessageEvent)));
  }
  observableFindPlayersAndGame(
    id: string,
  ): Observable<
    MessageEvent<MatchingInUsersAndGame | { [key: string]: never }>
  > {
    return interval(1500)
      .pipe(
        concatMap(() =>
          this.prismaService.matching.findUnique({
            where: {
              id,
            },
            include: {
              players: { include: { user: true } },
              game: true,
            },
          }),
        ),
      )
      .pipe(
        map(
          (matching) => {
            if (matching) {
              return {
                data: matching,
              } as MessageEvent;
            } else {
              return {
                data: {},
              } as MessageEvent;
            }
          },
          // (matching) =>
          //   ({
          //     data: matching,
          //   } as MessageEvent),
        ),
      );
  }

  async create(
    userId: string,
    dto: CreateMatchingDto,
  ): Promise<MatchingIdResponse> {
    const player = await this.prismaService.player.findUnique({
      where: { userId },
    });
    if (player) {
      await this.prismaService.player.delete({ where: { id: player.id } });
    }
    const matching = await this.prismaService.matching.create({
      data: {
        name: dto.name,
        password: dto.password,
        hostPlayer: {
          create: {
            userId,
          },
        },
        players: {
          connect: [{ userId }],
        },
        game: {
          create: {
            rule: {
              create: {
                timeLimit: dto.timeLimit,
                playerCount: dto.playerCount,
                roundCount: dto.roundCount,
                frontAndBack: dto.frontAndBack,
              },
            },
          },
        },
      },
    });
    return { matchingId: matching.id };
  }

  findAll(): Promise<MatchingInUsersAndHostAndRule[]> {
    // console.log('none');
    return this.prismaService.matching.findMany({
      include: {
        players: { include: { user: true } },
        hostPlayer: true,
        game: { include: { rule: true } },
      },
    });
  }

  findOne(id: string): Promise<MatchingInUsersAndHostAndRule> {
    // console.log('ok');
    return this.prismaService.matching.findUnique({
      where: {
        id,
      },
      include: {
        players: { include: { user: true } },
        hostPlayer: true,
        game: { include: { rule: true } },
      },
    });
  }

  async join(id: string, userId: string): Promise<MessageType> {
    const player = await this.prismaService.player.findUnique({
      where: { userId },
    });
    if (player) {
      await this.prismaService.player.delete({ where: { id: player.id } });
    }
    const matching = await this.prismaService.matching.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
        game: { include: { rule: true } },
      },
    });
    if (matching.players.length >= matching.game.rule.playerCount) {
      throw new BadRequestException('The matching is already full.');
    }

    await this.prismaService.matching.update({
      where: {
        id,
      },
      data: {
        players: {
          create: [{ userId }],
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

  async delete(id: string): Promise<MessageType> {
    const matching = await this.prismaService.matching.findUnique({
      where: { id },
    });
    await this.prismaService.game.delete({
      where: {
        id: matching.gameId,
      },
    });
    return { message: 'ok' };
  }

  async exit(userId: string): Promise<MessageType> {
    const player = await this.prismaService.player.findUnique({
      where: { userId },
      include: { hostMatching: true },
    });
    const matching = await this.prismaService.matching.findUnique({
      where: { id: player.joinMatchingId },
      include: { hostPlayer: true, players: true },
    });
    // if (matching.players.length === 1) {
    //   await this.prismaService.game.delete({
    //     where: {
    //       id: matching.gameId,
    //     },
    //   });
    // } else {
    if (player.id === matching.hostPlayer.id) {
      await this.prismaService.game.delete({
        where: { id: player.hostMatching.gameId },
      });
    } else {
      await this.prismaService.player.delete({ where: { id: player.id } });
    }
    // }

    return { message: 'ok' };
    // const player = await this.prismaService.player.findUnique({
    //   where: { userId },
    //   include: { hostMatching: true },
    // });
    // const matching = await this.prismaService.matching.findUnique({
    //   where: { id: player.joinMatchingId },
    //   include: { hostPlayer: true },
    // });
    // if (player.id === matching.hostPlayer.id) {
    //   await this.prismaService.game.delete({
    //     where: { id: player.hostMatching.gameId },
    //   });
    // } else {
    //   await this.prismaService.player.delete({ where: { id: player.id } });
    // }
    // return { message: 'ok' };
  }
  //   const player = await this.prismaService.player.findUnique({
  //     where: { userId },
  //   });
  //   await this.prismaService.player.delete({ where: { id: player.id } });
  //   return { message: 'ok' };
  // }
}
