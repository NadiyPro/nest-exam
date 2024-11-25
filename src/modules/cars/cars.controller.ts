import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { SkipAuth } from '../auth/decorators/skip_auth.decorator';
import { IUserData } from '../auth/models/interfaces/user_data.interface';
import { ApprovedRoleGuard } from '../guards/approved_role.guard';
import { Role } from '../guards/decorator/role.decorator';
import { RoleTypeEnum } from '../users/enums/RoleType.enum';
import { CreateCarsReqDto } from './models/dto/req/create_cars.req.dto';
import { CreateCarsResDto } from './models/dto/res/cars.res.dto';
import { CarsMapper } from './service/cars.mapper';
import { CarsService } from './service/cars.service';

@ApiTags('Users')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  @ApiOperation({
    summary: 'Для створення запису про автомобіль (бренд та модель)',
    description:
      'Користувач може створити новий запис про автомобіль (бренд та модель)' +
      'Доступно для ролей: admin, manager. ',
  })
  @SkipAuth()
  @Post('cars')
  public async createCars(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarsReqDto,
  ): Promise<CreateCarsResDto> {
    const result = await this.carsService.createCars(userData, dto);
    return result;
  }

  // @ApiBearerAuth()
  // @UseGuards(ApprovedRoleGuard)
  // @Role([RoleTypeEnum.SELLER])
  // @ApiOperation({
  //   summary:
  //     'Повідомити менеджера, про те що не вистачає зазначеної марки автомобіля (бренд та модель)',
  //   description:
  //     'Користувач повідомити менеджера, про те що не вистачає зазначеної марки автомобіля (бренд та модель).' +
  //     'Після чого, менеджер буде проінформований на пошту і при необхідності додасть його до списку' +
  //     'Доступно для ролей: admin, manager, seller. ',
  // })
  // @SkipAuth()
  // @Post('cars')
  // public async create(
  //   @CurrentUser() userData: IUserData,
  //   @Body() dto: CreateArticleDto,
  // ): Promise<ArticleResDto> {
  //   const result = await this.articlesService.create(userData, dto);
  //  await this.carsService.createCars(userData, dto);
  // }

  // @ApiOperation({
  //   summary: 'Для отримання списку всіх брендів авто',
  //   description:
  //     'Користувач може отримати список всіх брендів авто' +
  //     'Доступно для ролей: всі',
  // })
  // @SkipAuth()
  // @Get('cars_brands')
  // public async findAllBrands(
  //   @Query() query: ListUsersQueryReqDto, // Параметри передаються через @Query
  // ): Promise<ListResQueryDto> {
  //   const [entities, total] = await this.usersService.findAllBrands(query);
  //   return UserMapper.toAllResDtoList(entities, total, query);
  // }
  //
  // @ApiOperation({
  //   summary: 'Для отримання списку всіх моделей авто',
  //   description:
  //     'Користувач може отримати список всіх моделей авто' +
  //     'Доступно для ролей: всі',
  // })
  // @SkipAuth()
  // @Get('cars_models')
  // public async findAllModel(
  //   @Query() query: ListUsersQueryReqDto, // Параметри передаються через @Query
  // ): Promise<ListResQueryDto> {
  //   const [entities, total] = await this.usersService.findAllModel(query);
  //   return CarsMapper.toAllResDtoList(entities, total, query);
  // }
  //
  // @ApiOperation({
  //   summary: 'Для отримання списку всіх автомобілей (бренд та модель)',
  //   description:
  //     'Користувач може отримати список всіх автомобілей (бренд та модель)' +
  //     'Доступно для ролей: всі',
  // })
  // @SkipAuth()
  // @Get('all') // добавить в репозитории поиск по id юзера, посик по названию бренда / модели
  // public async findAllCars(
  //   @Query() query: ListUsersQueryReqDto, // Параметри передаються через @Query
  // ): Promise<ListResQueryDto> {
  //   const [entities, total] = await this.usersService.findAllCars(query);
  //   return CarsMapper.toAllResDtoList(entities, total, query);
  // }
  //
  // @ApiBearerAuth()
  // @UseGuards(ApprovedRoleGuard)
  // @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  // @ApiOperation({
  //   summary: 'Для оновлення запису про автомобіль (бренд/модель)',
  //   description:
  //     'Користувач може оновити запис про автомобіль (бренд/модель). ' +
  //     'Наприклад якщо була допущена помилка в записі та інше.' +
  //     'Доступно для ролей: admin, manager',
  // })
  // @Patch('me')
  // public async updateCars(
  //   @CurrentUser() userData: IUserData,
  //   @Body() updateUserDto: UpdateUserReqDto,
  // ) {
  //   const result = await this.usersService.updateCars(userData, updateUserDto);
  //   return UserMapper.toResDto(result);
  // }
  //
  // @ApiOperation({
  //   summary:
  //     'Для отримання списку всіх моделей що належать до конкретно обраного бренду (по id бренда)',
  //   description:
  //     'Користувач може отримати список всіх моделей що належать до конкретно обраного бренду (по id бренда).' +
  //     'Доступно для ролей: всім',
  // })
  // @SkipAuth()
  // @Get(':carsBrandsId')
  // public async findOne(
  //   @Param('carsBrandsId', ParseUUIDPipe) userId: string,
  // ): Promise<UserResDto> {
  //   const result = await this.usersService.findOne(userId);
  //   return UserMapper.toResDto(result); // повертати буде масив моделей які належать одному бренду по айді
  // }
  //
  // @ApiBearerAuth()
  // @UseGuards(ApprovedRoleGuard)
  // @Role([RoleTypeEnum.MANAGER, RoleTypeEnum.ADMIN])
  // @ApiOperation({
  //   summary: 'Для видалення бренду автомобіля за його id',
  //   description:
  //     'Користувач може видалити бренд автомобіля по його id. ' +
  //     'Зверніть увагу! При видалені бренда автомобіля буде каскадно видалено всі моделі закріплені за ним.' +
  //     'Доступно для ролей: admin, manager',
  // })
  // @Delete(':carsBrandsId') // тут додати каскадне видалення всіх моделей в емтіті
  // public async deleteCarsBrandsId(
  //   @Param('userId', ParseUUIDPipe) userId: string,
  // ): Promise<void> {
  //   return await this.usersService.deleteCarsBrandsId(userId);
  // }
  //
  // @ApiBearerAuth()
  // @UseGuards(ApprovedRoleGuard)
  // @Role([RoleTypeEnum.MANAGER, RoleTypeEnum.ADMIN])
  // @ApiOperation({
  //   summary: 'Для видалення моделі автомобіля за його id',
  //   description:
  //     'Користувач може видалити модель автомобіля по його id.' +
  //     'Доступно для ролей: admin, manager',
  // })
  // @Delete(':carsModelsId')
  // public async deleteId(
  //   @Param('carsModelsId', ParseUUIDPipe) userId: string,
  // ): Promise<void> {
  //   return await this.usersService.deleteId(userId);
  // }
}

// закинути логіку додавння фото авто в оголошення
// @ApiBearerAuth()
// @UseGuards(ApprovedRoleGuard)
// @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
// @ApiOperation({
//   summary: 'Для завантаження фото авто для розміщення його в оголошені',
//   description:
//     'Користувач може завантажити фото авто для розміщення його в оголошені.' +
//     'Доступно для ролей: admin, manager, seller',
// })
// @ApiConsumes('multipart/form-data')
// @UseInterceptors(FileInterceptor('image_cars'))
// @ApiFile('image_cars', false, true)
// @Post('me/image_cars') // IMAGE_CARS
// public async uploadImageCars(
//   @CurrentUser() userData: IUserData,
// @UploadedFile() file: Express.Multer.File,
// ): Promise<void> {
//   await this.usersService.uploadImageCars(userData, file);
// }
//
// @ApiBearerAuth()
// @UseGuards(ApprovedRoleGuard)
// @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
// @ApiOperation({
//   summary: 'Для видалення avatar користувачем із свого облікового запису',
//   description:
//     'Користувач може видалити avatar із свого облікового запису.' +
//     'Доступно для ролей: admin, manager, seller',
// })
// @Delete('me/avatar')
// public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
//   await this.usersService.deleteAvatar(userData);
