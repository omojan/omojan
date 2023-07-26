import { Injectable, Logger } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, Player, Word } from '@prisma/client';
import { MessageType } from 'src/types/util.type';
import {
  GameInPlayersAndRule,
  // GameInMatchingUsersAndHost,
  MountGame,
  UpdateGameState,
} from 'src/types/gameType';
import { Observable, concatMap, interval, map } from 'rxjs';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}
  logger = new Logger();

  // create(createGameDto: CreateGameDto) {
  //   return 'This action adds a new game';
  // }

  observableFindGame(
    id: string,
    playerId: string,
  ): Observable<MessageEvent<UpdateGameState>> {
    // ): Observable<MessageEvent<UpdateGame>> {
    return interval(1500)
      .pipe(
        concatMap(() =>
          this.prismaService.game.findUnique({
            where: { id },
            include: {
              players: { include: { user: true } },
              rounds: {
                include: {
                  orderPlayers: { include: { user: true } },
                  turns: { include: { player: true, text: true } },
                },
              },
            },
          }),
        ),
      )
      .pipe(
        map((game) => {
          if (game) {
            return {
              // data: game,
              data: {
                game,
                mePlayer: game.players.find((player) => player.id === playerId),
              },
            } as MessageEvent;
          } else {
            return {
              data: {},
            } as MessageEvent;
          }
        }),
      );
  }
  findAll() {
    return `This action returns all game`;
  }

  findOne(id: string): Promise<MountGame> {
    return this.prismaService.game.findUnique({
      where: {
        id,
      },
      include: {
        rule: true,
        players: { include: { user: true } },
        rounds: {
          include: {
            orderPlayers: { include: { user: true } },
            turns: { include: { player: true, text: true } },
          },
        },
        matching: {
          include: {
            players: { include: { user: true } },
            hostPlayer: true,
          },
        },
      },
    });
  }

  async join(id: string, playerId): Promise<MessageType> {
    const game = await this.prismaService.game.update({
      where: { id },
      data: { players: { connect: [{ id: playerId }] } },
      include: { players: true, rule: true },
    });
    if (game.players.length === game.rule.playerCount) {
      await this.prismaService.game.update({
        where: { id },
        data: { scene: 'OPENING' },
      });
    }
    return { message: 'ok' };
  }

  async gameInit(id: string): Promise<MessageType> {
    const game = await this.prismaService.game.findUnique({
      where: { id },
      include: { rule: true, players: true },
    });
    const wordDatas = await this.prismaService.word.findMany({
      select: { text: true },
    });
    const allWords = await wordDatas.map((wordData) => wordData.text);

    const words = await this.sliceByNumber(
      allWords
        .slice()
        .sort(() => Math.random() - Math.random())
        .slice(
          0,
          (game.rule.roundCount + 4) * game.rule.playerCount +
            game.rule.roundCount,
        ),
      game.rule.roundCount + 4,
    );

    const parentWords = await words.pop();

    await this.prismaService.game.update({
      where: { id },
      data: { parentWords },
    });
    for (let index = 0; index < words.length; index++) {
      await this.prismaService.player.update({
        where: { id: game.players[index].id },
        data: { words: words[index] },
      });
    }
    await this.createRound(game);

    //　本来はアニメーション終了後に実行
    await this.prismaService.game.update({
      where: { id: game.id },
      data: { scene: 'BATTLE' },
    });
    return { message: 'ok' };
  }

  async TurnUp(id: string): Promise<MessageType> {
    const game = await this.prismaService.game.findUnique({
      where: { id },
      include: { rounds: { include: { orderPlayers: true, turns: true } } },
    });
    const currentRound = game.rounds[game.rounds.length - 1];
    const currentRoundOrderPlayers = currentRound.orderPlayers;
    // game.rounds[game.rounds.length - 1].orderPlayers;
    const createTurnIndex = currentRound.turns.length;
    // this.orderChange(currentRoundOrderPlayers);
    await this.prismaService.round.update({
      where: { id: game.rounds[game.rounds.length - 1].id },
      data: {
        turns: {
          create: {
            player: {
              connect: { id: currentRoundOrderPlayers[createTurnIndex].id },
            },
          },
        },
      },
    });

    return { message: 'ok' };
  }

  async roundUp(id: string): Promise<MessageType> {
    const game = await this.prismaService.game.findUnique({
      where: { id },
      include: { rounds: { include: { orderPlayers: true, turns: true } } },
    });
    // await this.logger.log('game', game);
    const currentRound = await game.rounds[game.rounds.length - 1];
    const currentRoundOrderPlayers = await currentRound.orderPlayers;
    // this.logger.log(
    //   'find',
    //   currentRoundOrderPlayers.map((player) => player.id),
    // );
    // game.rounds[game.rounds.length - 1].orderPlayers;
    // const createTurnIndex = currentRound.turns.length;
    // console.log(currentRoundOrderPlayers[0].id);

    this.logger.log(
      'find',
      currentRoundOrderPlayers.map((player) => player.id),
    );
    // await this.orderChange(currentRoundOrderPlayers);
    // await this.orderChange(currentRoundOrderPlayers);
    const orderChangedPlayers = this.orderChange(currentRoundOrderPlayers)
    this.logger.log(
      'orderChange',
      currentRoundOrderPlayers.map((player) => player.id),
    );
    this.logger.log('create', [
      ...currentRoundOrderPlayers.map((player) => player.id),
    ]);
    // console.log(currentRoundOrderPlayers[0].id);
    // console.log(currentRoundOrderPlayers.map((player) => player.id));

    const resultGame = await this.prismaService.game.update({
      // await this.prismaService.game.update({
      where: { id },
      data: {
        rounds: {
          create: [
            // { turns: { create: [{ player: game.players[0] }] } },
            {
              orderPlayers: {
                connect:
                  // ...currentRoundOrderPlayers.map((player) => {
                  //   this.logger.log(player.id);
                  //   return {
                  //     id: player.id,
                  //   };
                  // }),
                  orderChangedPlayers.map((player) => ({
                  // currentRoundOrderPlayers.map((player) => ({
                    id: player.id,
                  })),
              },
              turns: {
                create: [
                  {
                    player: {
                      connect: {
                        id: currentRoundOrderPlayers[0].id,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      include: { rounds: { include: { orderPlayers: true, turns: true } } },
    });

    this.logger.log(
      'result',
      resultGame.rounds[resultGame.rounds.length - 1].orderPlayers.map(
        (player) => player.id,
      ),
    );

    return { message: 'ok' };
  }
  remove(id: number) {
    return `This action removes a #${id} game`;
  }

  async createRound(game: GameInPlayersAndRule): Promise<MessageType> {
    // ゲーム作成時の最初のラウンド作成にしか使えない(参照するプレイヤー)
    await this.prismaService.game.update({
      where: { id: game.id },
      data: {
        rounds: {
          create: [
            {
              orderPlayers: {
                connect: [...game.players.map((player) => ({ id: player.id }))],
              },
              turns: {
                create: [{ player: { connect: { id: game.players[0].id } } }],
              },
            },
          ],
        },
      },
      // include: { players: true },
    });
    // console.log(round);

    return { message: 'ok' };
  }

  sliceByNumber(words: string[], count): string[][] {
    const result: string[][] = [];

    words.forEach((item, index) => {
      if (index % count === 0) {
        result.push([]);
      }
      result[result.length - 1].push(item);
    });

    return result;
  }

  // orderChange(players: Player[]): void {
  //   const lastPlayer = players.pop();
  //   players.unshift(lastPlayer);
  // }
  orderChange(players: Player[]): Player[] {
    const lastPlayer = players.pop();
    players.unshift(lastPlayer);
    return players;
  }
}
