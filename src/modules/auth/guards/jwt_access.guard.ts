import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IsNull } from 'typeorm';

import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { UserMapper } from '../../users/service/user.mapper';
import { SKIP_AUTH } from '../decorators/skip_auth.decorator';
import { TokenType } from '../enums/token_type.enum';
import { AuthCacheService } from '../services/auth-cache.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class Jwt_accessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    // reflector.getAllAndOverride - перевіряє наявність метаданих SKIP_AUTH,
    // які додані за допомогою декоратора @SkipAuth() над маршрутом або класом
    // (в нашому прикладі над маршрутом/ендпоінтом),
    // щоб пропускати аутентифікацію для певних маршрутів
    // Використовує context.getHandler() (повертає функцію-обробник (метод)) та
    // context.getClass() (повертає клас в якому знаходиться метод-обробник)
    // для перевірки наявності метаданих SKIP_AUTH на рівні методу або класу.
    // Якщо метадані SKIP_AUTH знайдені на методі,
    // вони мають пріоритет над метаданими на рівні класу.
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    // дістаємо обєкт запиту (request) - це об'єкт,
    // таку як заголовки, параметри запиту, тіло запиту (body),
    // параметри маршруту (route params), тощо.
    // отримуємо HTTP-запит з контексту
    // через switchToHttp() ми доступаємось до HTTP запиту,
    // а через getRequest() дістаємо об'єкт запиту (request)
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    // дістанемо токен доступу з Authorization, беремо другий елемент масиву,
    // тобто все, що йде після слова "Bearer "
    // split() в JavaScript використовується для розділення рядка на масив,
    // використовуючи певний роздільник
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );
    // перевіряємо токен, чи був він створений з використанням
    // конкретного секретного ключа і чи не закінчився термін його дії
    if (!payload) {
      throw new UnauthorizedException();
    }
    const isAccessTokenExist = await this.authCacheService.isAccessTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );
    // Метод isAccessTokenExist використовується в класі Jwt_accessGuard
    // для перевірки, чи токен доступу вже існує в кеші
    if (!isAccessTokenExist) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOneBy({
      id: payload.userId,
      deleted: IsNull(),
      // deleted: IsNull() перевіряє, що поле deleted є null (тобто, користувач не видалений)
    });
    // шукаємо користувача в БД за userId, отриманим з токена
    if (!user) {
      throw new UnauthorizedException();
    }
    request.res.locals.user = UserMapper.toIUserData(user, payload);
    // UserMapper.toIUserData(user, payload) дані користувача перетворюються на формат,
    // зручний для передачі в наступні етапи обробки запиту
    // зберігає дані користувача, щоб вони були доступні у всьому ланцюжку обробки запиту
    return true;
    // вказує, що перевірка пройдена, і запит можна пропустити до наступного етапу.
  }
}
