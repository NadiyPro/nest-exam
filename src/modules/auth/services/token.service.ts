import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';

import { Config, JwtConfig } from '../../../configs/config.type';
import { TokenType } from '../enums/token_type.enum';
import { IJwtPayload } from '../models/interfaces/jwt_payload.interface';
import { ITokenPair } from '../models/interfaces/token_pair.interface';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    // забезпечує функції для створення та перевірки токенів
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = configService.get<JwtConfig>('jwt');
  }
  //  сервіс у NestJS для генерації та перевірки JWT-токенів,
  //  який використовує JwtService для створення токенів і
  //  ConfigService для доступу до конфігураційних параметрів JWT

  public async generateAuthTokens(payload: IJwtPayload): Promise<ITokenPair> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      // ключ, який використовується для підпису токена доступу
      expiresIn: this.jwtConfig.accessExpiresIn,
      // термін дії токена доступу
    });
    // signAsync створює асинхронно JWT-токен з вказаними даними і налаштуваннями

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
    });
    return { accessToken, refreshToken };
  } // генеруємо пару токенів accessToken та refreshToken
  // на основі наданого payload (даних, які включаються в токен)

  public async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<IJwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(type),
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // перевіряємо токен, чи був він створений з використанням
  // конкретного секретного ключа і чи не закінчився термін його дії

  private getSecret(type: TokenType): string {
    let secret: string;
    switch (type) {
      case TokenType.ACCESS:
        secret = this.jwtConfig.accessSecret;
        break;
      case TokenType.REFRESH:
        secret = this.jwtConfig.refreshSecret;
        break;
      default:
        throw new Error('Unknown token type');
    }
    return secret;
  }

  // private getSecretForTokenType(type: TokenType): string {
  //   if (type === TokenType.ACCESS) {
  //     return process.env.ACCESS_TOKEN_SECRET;
  //   } else if (type === TokenType.REFRESH) {
  //     return process.env.REFRESH_TOKEN_SECRET;
  //   }
  //   throw new Error('Invalid token type');
  // }
  // отримуємо secret і після цього перевіряємо наш токен у verifyToken
  // трохи вище функція
}
