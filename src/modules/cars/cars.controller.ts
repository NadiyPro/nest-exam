import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { SkipAuth } from '../auth/decorators/skip_auth.decorator';
import { IUserData } from '../auth/models/interfaces/user_data.interface';
import { ApprovedRoleGuard } from '../guards/approved_role.guard';
import { Role } from '../guards/decorator/role.decorator';
import { RoleTypeEnum } from '../users/enums/RoleType.enum';
import { CreateCarsReqDto } from './models/dto/req/create_cars.req.dto';
import { ListCarsQueryReqDto } from './models/dto/req/list-cars-query.req.dto';
import { CarsResDto } from './models/dto/res/cars.res.dto';
import { ListBrandResQueryDto } from './models/dto/res/list-brand-query.res.dto';
import { ListCarsQueryResDto } from './models/dto/res/list-cars-query.res.dto';
import { ListModelsResQueryDto } from './models/dto/res/list-models-query.res.dto';
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
  @Post()
  public async createCars(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarsReqDto,
  ): Promise<CarsResDto> {
    return await this.carsService.createCars(userData, dto);
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

  @ApiOperation({
    summary: 'Для отримання списку всіх брендів авто',
    description:
      'Користувач може отримати список всіх брендів авто' +
      'Доступно для ролей: всі',
  })
  @SkipAuth()
  @Get('cars_brands')
  public async findAllBrands(
    @Query() query: ListCarsQueryReqDto, // Параметри передаються через @Query
  ): Promise<ListBrandResQueryDto> {
    const [entities, total] = await this.carsService.findAllBrands(query);
    return CarsMapper.toAllResDtoBrands(entities, total, query);
  }

  @ApiOperation({
    summary: 'Для отримання списку всіх моделей авто',
    description:
      'Користувач може отримати список всіх моделей авто' +
      'Доступно для ролей: всі',
  })
  @SkipAuth()
  @Get('cars_models')
  public async findAllModel(
    @Query() query: ListCarsQueryReqDto, // Параметри передаються через @Query
  ): Promise<ListModelsResQueryDto> {
    const [entities, total] = await this.carsService.findAllModel(query);
    return CarsMapper.toAllResDtoModels(entities, total, query);
  }

  @ApiOperation({
    summary: 'Для отримання списку всіх автомобілей (бренд та модель)',
    description:
      'Користувач може отримати список всіх автомобілей (бренд та модель) ' +
      'та здійснити пошук по: назві бренду, моделі та id користувача.' +
      'Доступно для ролей: всі',
  })
  @SkipAuth()
  @Get()
  public async findAllCars(
    @Query() query: ListCarsQueryReqDto,
  ): Promise<ListCarsQueryResDto> {
    const [entities, total] = await this.carsService.findAllCars(query);
    return CarsMapper.toAllResDtoCars(entities, total, query);
  }

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  @ApiOperation({
    summary: 'Для оновлення запису про автомобіль (бренд/модель)',
    description:
      'Користувач може оновити запис про автомобіль (бренд/модель). ' +
      'Наприклад якщо була допущена помилка в записі та інше.' +
      'Доступно для ролей: admin, manager',
  })
  @Patch(':carsBrandsId')
  public async updateCars(
    @Param('carsBrandsId', ParseUUIDPipe) carsBrandsId: string,
    @Body() dto: CreateCarsReqDto,
  ): Promise<CarsResDto> {
    return await this.carsService.updateCars(carsBrandsId, dto);
  }

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
