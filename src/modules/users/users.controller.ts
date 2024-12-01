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
import { GiveRoleDto } from './models/dto/req/give_role.dto';
import { ListUsersQueryReqDto } from './models/dto/req/list-users-query.req.dto';
import { UpdateUserReqDto } from './models/dto/req/update_user.req.dto';
import { ListResQueryDto } from './models/dto/res/list-users-query.res.dto';
import { UserResDto } from './models/dto/res/user.res.dto';
import { UserMapper } from './service/user.mapper';
import { UsersService } from './service/users.service';
import { UsersJSONService } from './usersJSON/service/usersJSON.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersJSONService: UsersJSONService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN])
  @ApiOperation({
    summary: 'Завантажити з файлу JSON користувачів для тестування',
    description:
      'Користувач з ролью admin може завантажити з файлу JSON користувачів для тестування' +
      'Доступно для ролей: admin',
  })
  @Post('import')
  async importCarsJSON(): Promise<string> {
    await this.usersJSONService.importUsersJSON();
    return 'Users data has been successfully imported into the database.';
  }

  @ApiOperation({
    summary: 'Для отримання інформацію про всі облікові записи користувачів',
    description:
      'Користувач може отримати інформацію про всі облікові записи користувачів' +
      ' та здійснити пошук по name користувача. ' +
      '*відображаються всі актуальні користувачі, ' +
      'видалені користувачі з датою видалення зберігаються в БД.' +
      'Доступно для ролей: всім',
  })
  @SkipAuth()
  @Get('all')
  public async findAll(
    @Query() query: ListUsersQueryReqDto, // Параметри передаються через @Query
  ): Promise<ListResQueryDto> {
    const [entities, total] = await this.usersService.findAll(query);
    return UserMapper.toAllResDtoList(entities, total, query);
  }

  @ApiOperation({
    summary: 'Для отримання інформації користувачем про свій обліковий запис',
    description:
      'Користувач може отримати інформацію про свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @Get('me')
  public async findMe(@CurrentUser() userData: IUserData) {
    const result = await this.usersService.findMe(userData);
    return UserMapper.toResDto(result);
  }

  @ApiOperation({
    summary: 'Для оновлення свого облікового запису користувачем',
    description:
      'Користувач може оновити свій обліковий запис (name та phone).' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ) {
    const result = await this.usersService.updateMe(userData, updateUserDto);
    return UserMapper.toResDto(result);
  }

  @ApiOperation({
    summary: 'Для видалення користувачем свого облікового запису',
    description:
      'Користувач може видалити свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData) {
    return await this.usersService.removeMe(userData);
  }

  @ApiOperation({
    summary: 'Для завантаження avatar користувачем у свій обліковий запис',
    description:
      'Користувач може завантажити avatar у свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiFile('avatar', false, true)
  @Post('me/avatar')
  public async uploadAvatar(
    @CurrentUser() userData: IUserData,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    console.log(userData.role);
    await this.usersService.uploadAvatar(userData, file);
  }

  @ApiOperation({
    summary: 'Для видалення avatar користувачем із свого облікового запису',
    description:
      'Користувач може видалити avatar із свого облікового запису.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.usersService.deleteAvatar(userData);
  }

  @ApiOperation({
    summary: 'Для видачі ролей',
    description:
      'Доступно для ролей: ' +
      '- Користувач з ролью admin може видавати всім всі ролі;' +
      'admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  @Patch('role/:user_id')
  async giveRole(
    @Param('user_id') user_id: string,
    @Body() giveRoleDto: GiveRoleDto,
    @CurrentUser() userData: IUserData,
  ): Promise<UserResDto> {
    const result = await this.usersService.giveRole(
      user_id,
      giveRoleDto.new_role,
      userData.role,
    );
    return UserMapper.toResDto(result);
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
    summary: 'Для видалення облікового запису користувача за його id',
    description:
      'Користувач може видалити обліковий запис іншого користувача по його id ' +
      '*в БД в стовбчику deleted буде вказано дату видалення користувача.' +
      'Доступно для ролей: admin, manager',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.MANAGER, RoleTypeEnum.ADMIN])
  @Delete(':userId')
  public async deleteId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<string> {
    return await this.usersService.deleteId(userId);
  }
}
