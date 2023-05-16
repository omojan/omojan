// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PrismaService } from '../../prisma/prisma.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly prismaService: PrismaService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (req) => {
//           let jwt = null;
//           if (req && req.cookies) {
//             jwt = req.cookies['next-auth.session-token'];
//           }
//           return jwt;
//         },
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('NEXTAUTH_SECRET'),
//     });
//   }

//   async validate(payload: { sub: string; email: string }) {
//     const user = await this.prismaService.user.findUnique({
//       where: {
//         id: payload.sub,
//       },
//     });
//     return user;
//   }
// }

