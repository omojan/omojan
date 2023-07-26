import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '@prisma/client';
import { Request } from 'express';
import { MessageType } from 'src/types/util.type';
import { MountGame, UpdateGameState } from 'src/types/gameType';
import { RestGuard } from 'src/auth/guards/rest.guard';
import { Observable } from 'rxjs';

@Controller('game')
@UseGuards(RestGuard)
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly prismaService: PrismaService,
  ) {}

  @Sse(':id/state')
  observableFindGame(
    @Param('id') id: string,
    @Req() req: Request,
  ): Observable<MessageEvent<UpdateGameState>> {
    // ): Observable<MessageEvent<UpdateGame>> {
    return this.gameService.observableFindGame(id, req.user.player.id);
  }

  // @Post()
  // async create(@Body() createGameDto: CreateGameDto) {
  //   return this.gameService.create(createGameDto);
  //   // return this.prismaService.game.create
  // }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MountGame> {
    return this.gameService.findOne(id);
  }

  @Patch(':id/join')
  join(@Param('id') id: string, @Req() req: Request): Promise<MessageType> {
    return this.gameService.join(id, req.user.player.id);
  }
  @Patch(':id/init')
  gameInit(@Param('id') id: string): Promise<MessageType> {
    return this.gameService.gameInit(id);
  }
  @Patch(':id/roundup')
  roundUp(@Param('id') id: string): Promise<MessageType> {
    return this.gameService.roundUp(id);
  }
  @Patch(':id/turnup')
  turnUp(@Param('id') id: string): Promise<MessageType> {
    return this.gameService.TurnUp(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
