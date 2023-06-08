import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerInUser } from 'src/matching/types/playerType';

@Injectable()
export class PlayerService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createPlayerDto: CreatePlayerDto) {
    return 'This action adds a new player';
  }

  findAll() {
    return `This action returns all player`;
  }
  async meFind(id: string): Promise<PlayerInUser> {
    // return this.prismaService.player.findUnique({
    //   where: { userId: id },
    //   include: { user: true },
    // });
    const mePlayer = await this.prismaService.player.findUnique({
      where: { userId: id },
      include: { user: true },
    });
    return mePlayer
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}
