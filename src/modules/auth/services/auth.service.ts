import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RefreshTokenRepository } from '../../../infrastructure/repository/services/refresh-token.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { UserMapper } from '../../users/service/user.mapper';
import { LoginReqDto } from '../models/dto/req/login.req.dto';
import { RegistrationReqDto } from '../models/dto/req/registration.req.dto';
import { AuthResDto } from '../models/dto/res/auth.res.dto';
import { TokenPairResDto } from '../models/dto/res/token_pair.res.dto';
import { IUserData } from '../models/interfaces/user_data.interface';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authCacheService: AuthCacheService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async signUp(dto: RegistrationReqDto): Promise<AuthResDto> {
    await this.isEmailNotExistOrThrow(dto.email);
    const password = await bcrypt.hash(dto.password, 10);
    // хешуємо пароль
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    // create - створює нову сутність (нового юзера та захешований пароль)
    // save - зберігає нову створену сутність в БД

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });
    // генеруємо пару токенів для нового юзера (accessToken та refreshToken)
    await Promise.all([
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        dto.deviceId,
      ),
      // зберігаємо accessToken для нового юзера в кеш (Redis)
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          deviceId: dto.deviceId,
          refreshToken: tokens.refreshToken,
        }),
      ),
      // зберігаємо refreshToken для нового юзера в БД
      // create - створює нову сутність(нового юзера та захешований пароль)
      // save - зберігає нову створену сутність в БД
    ]);
    // Promise.all іиконує асинхроних запуск, тобто
    // одночасно буде виконуватися запис аксес токенів в кеш і рефреш токена в БД

    return { user: UserMapper.toResDto(user), tokens };
    // Метод UserMapper.toResDto бере об'єкт user типу UserEntity,
    // отриманий з бази даних, і перетворює його (мапає) на об'єкт UserResDto.
    // Це робиться для того, щоб відправити фронт енду тільки потрібні і безпечні поля
    // (такі як id, name, email, тощо) і приховати внутрішні дані (наприклад, пароль)
    //  потім повертаємо у відповідь безпечну інфо по юзеру та пару токенів по ньому
  }

  public async signIn(dto: LoginReqDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email }, // знаходимо користувача за електронною поштою
      select: ['id', 'password'],
      //  select - дозволяє витягнути лише id та password користувача, що оптимізує запит.
    });
    if (!user) {
      throw new UnauthorizedException();
    } // Якщо користувача не знайдено, буде викинуто помилку,
    //  яка повідомляє, що користувач не авторизований

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    // перевіряємо, чи збігається пароль, введений користувачем (dto.password),
    // з паролем, збереженим у базі даних (user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });
    // генеруємо пару токенів accessToken і refreshToken на основі userId та deviceId
    await Promise.all([
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        dto.deviceId,
      ), // зберігаємо access токен в кеш (Redis)
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          deviceId: dto.deviceId,
          refreshToken: tokens.refreshToken,
        }),
      ), // зберігаємо refreshToken токен в БД
      // create - створює нову сутність(нового юзера та захешований пароль)
      // save - зберігає нову створену сутність в БД
    ]);
    // Promise.all, щоб паралельно зберегти токени в різних місцях для кращої продуктивності
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    // витягаємо з БД повну інфо про користувача (всі поля), використовуючи його id

    return { user: UserMapper.toResDto(userEntity), tokens };
    // Метод UserMapper.toResDto бере об'єкт user типу UserEntity,
    // отриманий з бази даних, і перетворює його (мапає) на об'єкт UserResDto.
  }

  public async signOut(userData: IUserData): Promise<void> {
    await Promise.all([
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
      this.refreshTokenRepository.delete({
        user_id: userData.userId,
        deviceId: userData.deviceId,
      }),
    ]);
    // видаляємо по юзеру всі accessToken та refreshToken токени
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    await Promise.all([
      this.authCacheService.deleteToken(userData.userId, userData.deviceId),
      // видаляємо всі accessToken токени, збережені для цього ключа в кеші (Redis)
      this.refreshTokenRepository.delete({
        user_id: userData.userId,
        deviceId: userData.deviceId,
      }), // видаляємо всі refreshToken,
      // що зберігаються в базі даних для конкретного користувача та його пристрою
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
    });
    // генеруємо пару токенів accessToken і refreshToken на основі userId та deviceId
    await Promise.all([
      this.authCacheService.saveToken(
        tokens.accessToken,
        userData.userId,
        userData.deviceId,
      ),
      // зберігаємо access токен в кеш (Redis)
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: userData.userId,
          deviceId: userData.deviceId,
          refreshToken: tokens.refreshToken,
        }),
      ), // зберігаємо refreshToken токен в БД
      // create - створює нову сутність(нового юзера та захешований пароль)
      // save - зберігає нову створену сутність в БД
    ]);

    return tokens; // повертаємо пару токенів accessToken і refreshToken
  }

  private async isEmailNotExistOrThrow(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new Error('Email already exists');
    }
  } // перевіряємо на унікальність email, тобто,
  // якщо в нас вже є юзер з таким email, то ми кинемо помилку,
  // бо email у юзера при реєстрації signUp на нашій платформі, має бути унікальним
  // findOne відрізняється від findOneBy тим що:
  // findOne - приймає собі обєкт з купою різних варіантів,
  // тобто запис є таким - findOne({where: { email }})
  // findOneBy - прийймає одразу варіанти, тобто запис буде findOneBy({ email })
  // але суть в них однакова, просто один трохои довший запис,а інший трох коротший
}
