import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RefreshTokenRepository } from '../../../infrastructure/repository/services/refresh-token.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { RoleTypeEnum } from '../../users/enums/RoleType.enum';
import { UserMapper } from '../../users/service/user.mapper';
import { LoginReqDto } from '../models/dto/req/login.req.dto';
import { RegistrationReqDto } from '../models/dto/req/registration.req.dto';
import { AuthResDto } from '../models/dto/res/auth.res.dto';
import { TokenPairResDto } from '../models/dto/res/token_pair.res.dto';
import { IUserData } from '../models/interfaces/user_data.interface';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authCacheService: AuthCacheService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly usersService: UsersService,
  ) {}

  public async registration(dto: RegistrationReqDto): Promise<AuthResDto> {
    await this.isEmailNotExistOrThrow(dto.email, dto.phone);
    const password = await bcrypt.hash(dto.password, 10);
    // const user = await this.userRepository.save(
    //   this.userRepository.create({ ...dto, password }),
    // );
    const user = await this.userRepository.save(
      this.userRepository.create({
        ...dto,
        password,
        role: RoleTypeEnum.SELLER,
      }),
    );

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
    ]);
    return { user: UserMapper.toResDto(user), tokens };
  }

  private async isEmailNotExistOrThrow(email: string, phone: string) {
    const userEmail = await this.userRepository.findOneBy({ email, phone });
    if (userEmail) {
      throw new Error('Email already exists');
    }
  }

  public async login(dto: LoginReqDto): Promise<any> {
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
      ),
    ]);
    // Promise.all, щоб паралельно зберегти токени в різних місцях для кращої продуктивності
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    // витягаємо з БД повну інфо про користувача (всі поля), використовуючи його id

    return { user: UserMapper.toResDto(userEntity), tokens };
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
      ),
    ]);

    return tokens; // повертаємо пару токенів accessToken і refreshToken
  }

  public async signOutUserId(user_id: string): Promise<void> {
    await Promise.all([
      this.authCacheService.deleteToken(user_id, deviceId),
      this.refreshTokenRepository.delete({
        user_id: user_id,
        deviceId: deviceId,
      }),
    ]);
  }
}
