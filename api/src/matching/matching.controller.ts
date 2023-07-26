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
  Sse,
} from '@nestjs/common';
import { Request } from 'express';
import { MatchingService } from './matching.service';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { RestGuard } from 'src/auth/guards/rest.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { Observable } from 'rxjs';
import {
  MatchingIdResponse,
  MatchingInUsersAndGame,
  MatchingInUsersAndHostAndRule,
} from '../types/matching.type';
import { MessageType } from '../types/util.type';

@Controller('matching')
@UseGuards(RestGuard)
export class MatchingController {
  constructor(
    private readonly matchingService: MatchingService,
    private readonly prismaService: PrismaService,
  ) {}

  @Sse('list')
  observableFindAll(): Observable<
    MessageEvent<MatchingInUsersAndHostAndRule[]>
  > {
    return this.matchingService.observableFindAll();
  }

  @Sse(':id/participant')
  observableFindPlayersAndGame(
    @Req() @Param('id') id: string,
  ): Observable<
    MessageEvent<MatchingInUsersAndGame | { [key: string]: never }>
  > {
    return this.matchingService.observableFindPlayersAndGame(id);
  }

  @Post()
  create(
    @Req() req: Request,
    @Body() dto: CreateMatchingDto,
  ): Promise<MatchingIdResponse> {
    return this.matchingService.create(req.user.id, dto);
  }

  @Get()
  findAll(): Promise<MatchingInUsersAndHostAndRule[]> {
    return this.matchingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MatchingInUsersAndHostAndRule> {
    return this.matchingService.findOne(id);
  }

  @Patch(':id/join')
  join(@Param('id') id: string, @Req() req: Request): Promise<MessageType> {
    return this.matchingService.join(id, req.user.id);
  }
  @Patch(':id/close')
  closeMatching(@Param('id') id: string): Promise<MessageType> {
    return this.matchingService.closeMatching(id);
  }
  @Delete(':id/delete')
  delete(@Param('id') id: string): Promise<MessageType> {
    return this.matchingService.delete(id);
  }
  @Delete('exit')
  exit(@Req() req: Request): Promise<MessageType> {
    return this.matchingService.exit(req.user.id);
  }
}
