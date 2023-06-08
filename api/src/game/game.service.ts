import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '@prisma/client';
import { MessageType } from 'src/matching/types/util.type';
import { GameInMatchingUsersAndHost } from 'src/matching/types/gameType';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: string): Promise<GameInMatchingUsersAndHost> {
    return this.prismaService.game.findUnique({
      where: {
        id,
      },
      include: {
        rule: true,
        matching: {
          include: {
            players: { include: { user: true } },
            hostPlayer: { include: { user: true } },
          },
        },
      },
    });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  // async gatherFromMatching(id: string): Promise<MessageType> {
  //   const game = await this.prismaService.game.findUnique({
  //     where: { id },
  //     include: { matching: { include: { rule: true } } },
  //   });
  //   const newGame = await this.prismaService.game.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       participant: game.participant + 1,
  //     },
  //   });
  //   if (newGame.participant === game.matching.rule.playerCount) {
  //     await this.prismaService.game.update({
  //       where: {
  //         id,
  //       },
  //       data: { scene: 'OPENING' },
  //     });
  //   }
  //   return { message: 'ok' };
  // }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
