import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiFile } from '../../common/decorators/api-file.decorator';
import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { SkipAuth } from '../auth/decorators/skip_auth.decorator';
import { IUserData } from '../auth/models/interfaces/user_data.interface';
import { ApprovedRoleGuard } from './guards/approved_role';
import { BaseUserReqDto } from './models/dto/req/base_user.req.dto';
import { UserResDto } from './models/dto/res/user.res.dto';
import { UserMapper } from './service/user.mapper';
import { UsersService } from './service/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAccessGuard)
  // для того, щоб підключити перевірку через guards
  // (в swagger біля цього шляху буде відображено замочок)
  // @UseGuards() повинен бути розміщенний обовязково біля @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard.approvedNotSeller)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Для отримання інформації користувачем про свій обліковий запис',
    description:
      'Користувач може отримати інформацію про свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @Get('me')
  public async findMe(@CurrentUser() userData: IUserData) {
    const result = await this.usersService.findMe(userData);
    return UserMapper.toResDto(result);
  }

  @UseGuards(ApprovedRoleGuard.approvedNotSeller)
  @ApiOperation({
    summary: 'Для оновлення свого облікового запису користувачем',
    description:
      'Користувач може оновити свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: BaseUserReqDto,
  ) {
    const result = await this.usersService.updateMe(userData, updateUserDto);
    return UserMapper.toResDto(result);
  }

  @UseGuards(ApprovedRoleGuard.approvedNotSeller)
  @ApiOperation({
    summary: 'Для видалення користувачем свого облікового запису',
    description:
      'Користувач може видалити свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData) {
    return await this.usersService.removeMe(userData);
  }

  @UseGuards(ApprovedRoleGuard.approvedNotSeller)
  @ApiOperation({
    summary: 'Для завантаження avatar користувачем у свій обліковий запис',
    description:
      'Користувач може завантажити avatar у свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  // вказує, що для цього маршруту потрібна аутентифікація через Bearer-токен
  @ApiConsumes('multipart/form-data')
  // зазначає, що цей маршрут очікує дані у форматі multipart/form-data,
  // який використовується для передачі файлів
  @UseInterceptors(FileInterceptor('avatar'))
  // підключає інтерсептор FileInterceptor для обробки файлу,
  // який надходить із полем avatar із swagger
  // FileInterceptor (з бібліотеки @nestjs/platform-express) зчитує файл з запиту
  // (які у файлу fieldname (у нас — avatar), mimetype, buffer, size та ін)
  // і додає його всі дані (властивості) file у функцію, і вже з uploadAvatar
  // ми передаємо в usersService, де перевіряємо в fileStorageService та
  // зберігаємо оновлені дані по юзеру в БД з аватаром
  @ApiFile('avatar', false, true)
  // @ApiFile - це наш кастомний декоратор ,
  // який налаштовує відображення форми у Swagger
  // де можна завантажити файли в поле (з назвою 'avatar')
  // avatar - ключ (назва поля в яке ми будем завантажувати файл)
  // false - передаємо інфо на обробку, що це не масив
  // true - вказуємо що ключ є обовязковим
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    // витягаємо інфо про поточного користувача від якого робиться запит
    @UploadedFile() file: Express.Multer.File,
    // вказує, що файл передається як параметр file у метод.
    // Тип Express.Multer.File вказує, що це файл,
    // оброблений за допомогою Multer
  ): Promise<void> {
    await this.usersService.uploadAvatar(userData, file);
  }

  @UseGuards(ApprovedRoleGuard.approvedNotSeller)
  @ApiOperation({
    summary: 'Для видалення avatar користувачем із свого облікового запису',
    description:
      'Користувач може видалити avatar із свого облікового запису.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.deleteAvatar(userData);
  }

  @ApiOperation({
    summary:
      'Для отримання інформацію про обліковий запис користувача за його id',
    description:
      'Користувач може отримати інформацію про обліковий запис будь якого зареєстрованого користувача по його id.' +
      'Доступно для ролей: admin, manager, seller, buyer',
  })
  @SkipAuth()
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResDto(result);
  }
}
