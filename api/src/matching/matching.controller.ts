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
import { MatchingIdResponseType, MatchingInPlayers, MatchingInPlayersAndRule } from './types/matching.type';
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
  observableFindAll(): Observable<MessageEvent<MatchingInPlayers[]>> {
    return this.matchingService.observableFindAll();
  }

  @Sse(':id/participant')
  observableFindPlayers(
    @Req() @Param('id') id: string,
  ): Observable<MessageEvent<User[]>> {
    return this.matchingService.observableFindPlayers(id);
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
  ): Promise<MatchingIdResponseType> {
    return this.matchingService.create(req.user.id, dto);
  }

  @Get()
  findAll(): Promise<MatchingInPlayers[]> {
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prismaService.matching.delete({
      where: {
        id: id,
      },
    });
  }
}
