import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '@prisma/client';
import { GameInMtchingInRule } from 'src/matching/types/gameType';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
    // return this.prismaService.game.create
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GameInMtchingInRule> {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
