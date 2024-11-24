import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
import { ApprovedRoleGuard } from '../guards/approved_role.guard';
import { Role } from '../guards/decorator/role.decorator';
import { RoleTypeEnum } from './enums/RoleType.enum';
import { ListUsersQueryReqDto } from './models/dto/req/list-users-query.req.dto';
import { UpdateUserReqDto } from './models/dto/req/update_user.req.dto';
import { ListResQueryDto } from './models/dto/res/list-users-query.res.dto';
import { UserResDto } from './models/dto/res/user.res.dto';
import { UserMapper } from './service/user.mapper';
import { UsersService } from './service/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
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

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @ApiOperation({
    summary: 'Для оновлення свого облікового запису користувачем',
    description:
      'Користувач може оновити свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ) {
    const result = await this.usersService.updateMe(userData, updateUserDto);
    return UserMapper.toResDto(result);
  }

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @ApiOperation({
    summary: 'Для видалення користувачем свого облікового запису',
    description:
      'Користувач може видалити свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData) {
    return await this.usersService.removeMe(userData);
  }

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @ApiOperation({
    summary: 'Для завантаження avatar користувачем у свій обліковий запис',
    description:
      'Користувач може завантажити avatar у свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiFile('avatar', false, true)
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.usersService.uploadAvatar(userData, file);
  }

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @ApiOperation({
    summary: 'Для видалення avatar користувачем із свого облікового запису',
    description:
      'Користувач може видалити avatar із свого облікового запису.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.deleteAvatar(userData);
  }

  @ApiOperation({
    summary:
      'Для отримання інформацію про обліковий запис користувача за його id',
    description:
      'Користувач може отримати інформацію про обліковий запис будь якого зареєстрованого користувача по його id.' +
      'Доступно для ролей: всім',
  })
  @SkipAuth()
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResDto> {
    const result = await this.usersService.findOne(userId);
    return UserMapper.toResDto(result);
  }

  @ApiOperation({
    summary: 'Для отримання інформацію про всі облікові записи користувачів',
    description:
      'Користувач може отримати інформацію про всі облікові записи користувачів.' +
      'Доступно для ролей: всім',
  })
  @SkipAuth()
  @Get('all')
  public async findAll(
    @Query() query: ListUsersQueryReqDto,
    // @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ListResQueryDto> {
    const [entities, total] = await this.usersService.findAll(query);
    // entities — список знайдених статей
    // total — загальна кількість статей,
    // що відповідають умовам запиту (використовується для пагінації)
    return UserMapper.toAllResDtoList(entities, total, query);
    // перетворюємо дані з entities, total та query у структуру
  }

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.MANAGER, RoleTypeEnum.ADMIN])
  @ApiOperation({
    summary: 'Для видалення облікового запису користувача за його id',
    description:
      'Користувач може видалити обліковий запис іншого користувача по його id.' +
      'Доступно для ролей: admin, manager',
  })
  @Delete(':userId')
  public async deleteId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return await this.usersService.deleteId(userId);
  }
}
