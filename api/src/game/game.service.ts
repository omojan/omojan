import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '@prisma/client';
import { GameInMtchingInRule } from 'src/matching/types/gameType';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: string): Promise<GameInMtchingInRule> {
    return this.prismaService.game.findUnique({
      where: {
        id,
      },
      include: {
        matching: {
          include: {
            rule: true,
            players:true,
            hostUser:true
          },
        },
      },
    });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
