import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('word')
  async wordSeeder() {
    await this.prismaService.word.createMany({
      data: [
        { text: 'ポテトサラダ' },
        { text: '始めました' },
        { text: '黒' },
        { text: 'ボンジュール' },
        { text: 'あなたも私も' },
        { text: '音頭' },
        { text: 'MacBook' },
        { text: 'マッハ' },
        { text: 'ですたい' },
        { text: '美術館' },
        { text: 'ナルシスト' },
        { text: 'プラン' },
        { text: '角材' },
        { text: '地底人' },
        { text: '寄生' },
        { text: '最大級' },
        { text: '除菌済み' },
        { text: 'はつらいよ' },
        { text: '動画' },
        { text: '水族館' },
        { text: '体育会系' },
        { text: 'カタログ' },
        { text: 'タイム' },
        { text: '皆様ご存知' },
        { text: '水族館' },
        { text: '皆様ご存知' },
        { text: 'あらかた' },
        { text: 'タイムトラベル' },
        { text: '事情通' },
        { text: '色' },
        { text: '弾幕' },
        { text: 'しかるべき' },
        { text: '保護区域' },
        { text: '毛根' },
        { text: 'ソーラン節' },
        { text: '売り切れご免！' },
        { text: '出し入れ' },
        { text: '尿意' },
        { text: 'メンタル面' },
        { text: 'スレンダー' },
        { text: 'フード' },
        { text: 'ほのかな' },
        { text: '国境なき' },
        { text: '風邪' },
        { text: 'コーチ' },
        { text: '離婚' },
        { text: 'マスター' },
        { text: 'ダミー' },
      ],
    });
    return { message: 'ok' };
  }
}
