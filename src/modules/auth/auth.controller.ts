import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApprovedRoleGuard } from '../guards/approved_role.guard';
import { Role } from '../guards/decorator/role.decorator';
import { RoleTypeEnum } from '../users/enums/RoleType.enum';
import { UsersService } from '../users/service/users.service';
import { CurrentUser } from './decorators/current_user.decorator';
import { SkipAuth } from './decorators/skip_auth.decorator';
import { Jwt_refreshGuard } from './guards/jwt_refresh.guard';
import { LoginReqDto } from './models/dto/req/login.req.dto';
import { RegistrationReqDto } from './models/dto/req/registration.req.dto';
import { AuthResDto } from './models/dto/res/auth.res.dto';
import { TokenPairResDto } from './models/dto/res/token_pair.res.dto';
import { IUserData } from './models/interfaces/user_data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({
    summary: 'Для реєстрації облікового запису користувача',
    description:
      'Користувач реєструє свй обліковий запис на платформі.' +
      '*При реєстрації роль buyer автоматично змінюється на роль seller.',
  })
  @Post('registration')
  public async registration(
    @Body() dto: RegistrationReqDto,
  ): Promise<AuthResDto> {
    return await this.authService.registration(dto);
  }
  // singUp - тут логінація вконується (перший вхід з хешуванням паролю)

  @SkipAuth()
  @ApiOperation({
    summary: 'Для логінації на платформі',
    description:
      'Користувач виконує логінацію для входу на платформу (користувач вже зареєстрований).',
  })
  @Post('login')
  public async login(@Body() dto: LoginReqDto): Promise<AuthResDto> {
    return await this.authService.login(dto);
  }
  // signIn - тут проходить аутентифікація,
  // перевірка чи існує в нас такий юзер з таким то паролем,
  // якщо існує то генеруємо нову пару токенів
  // (повторний вхід, перевірка паролю, ат видача нової пари токенів)

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Для видалення свого облікового запису користувачем',
    description: 'Користувач може видалити свій обліковий запис.',
  })
  @Post('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.signOut(userData);
  }
  // хочемо переходячи по даному шляху, видалят токени
  // які належать конкретному юзеру userData
  // userData містить в собі userId, deviceId, email

  @ApiOperation({
    summary: 'Для отримання нової пари токенів',
    description: 'Для отримання нової пари токенів.',
  })
  @ApiBearerAuth()
  @UseGuards(Jwt_refreshGuard)
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }

  @ApiOperation({
    summary:
      'Для видалення облікового запису користувача за його user_id ("бан")',
    description:
      'Користувач може видалити обліковий запис іншого користувача за його user_id, ' +
      'таким чином поставити користувача в "бан". Доступно для ролей: admin, manager',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  @Post('sign-out/:user_id,')
  public async signOutUserId(
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ): Promise<void> {
    return await this.authService.signOutUserId(user_id);
  }
}
