import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Sse,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { MatchingService } from './matching.service';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { RestGuard } from 'src/auth/guards/rest.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { Matching, User } from '@prisma/client';
import { Observable, concatMap, interval, map } from 'rxjs';
import {
  MatchingIdResponse,
  MatchingInPlayers,
  MatchingInPlayersAndRule,
  MatchingInPlayersAndGame,
} from './types/matching.type';
import { MessageType } from './types/util.type';
import { decode } from 'next-auth/jwt';

@Controller('matching')
@UseGuards(RestGuard)
export class MatchingController {
  constructor(
    private readonly matchingService: MatchingService,
    private readonly prismaService: PrismaService,
  ) {}

  @Sse('list')
  observableFindAll(): Observable<MessageEvent<MatchingInPlayersAndRule[]>> {
    return this.matchingService.observableFindAll();
  }

  @Sse(':id/participant')
  observableFindPlayersAndGame(
    @Req() @Param('id') id: string,
  ): Observable<MessageEvent<MatchingInPlayersAndGame[]>> {
    return this.matchingService.observableFindPlayersAndGame(id);
  }
  // @Sse('participant')
  // observableFindPlayers(@Req() req: Request): Observable<MessageEvent<User[]>> {
  //   return this.matchingService.observableFindPlayers(
  //     req.cookies['next-auth.session-token'],
  //   );
  // }

  @Post()
  create(
    @Req() req: Request,
    @Body() dto: CreateMatchingDto,
  ): Promise<MatchingIdResponse> {
    return this.matchingService.create(req.user.id, dto);
  }

  @Get()
  findAll(): Promise<MatchingInPlayersAndRule[]> {
    return this.matchingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MatchingInPlayersAndRule> {
    return this.matchingService.findOne(id);
  }

  @Patch(':id/join')
  join(@Param('id') id: string, @Req() req: Request): Promise<MessageType> {
    return this.matchingService.join(id, req.user.id);
  }
  @Patch(':id/exit')
  exit(@Param('id') id: string, @Req() req: Request): Promise<MessageType> {
    return this.matchingService.exit(id, req.user.id);
  }
  @Patch(':id/close')
  closeMatching(@Param('id') id: string): Promise<MessageType> {
    return this.matchingService.closeMatching(id);
  }
  // @Patch(':id/success')
  // success(@Param('id') id: string): Promise<MessageType> {}

  @Delete(':id')
  remove(@Param('id') id: string): Promise<MessageType> {
    return this.matchingService.remove(id);
  }
}
