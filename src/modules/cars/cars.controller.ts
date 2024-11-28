import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { EmailTypeEnum } from '../email/enums/email.enum';
import { EmailService } from '../email/service/email.service';
import { ApprovedRoleGuard } from '../guards/approved_role.guard';
import { Role } from '../guards/decorator/role.decorator';
import { RoleTypeEnum } from '../users/enums/RoleType.enum';
import { UsersService } from '../users/service/users.service';
import { CreateCarsReqDto } from './models/dto/req/create_cars.req.dto';
import { ListCarsQueryReqDto } from './models/dto/req/list-cars-query.req.dto';
import { CarsResDto } from './models/dto/res/cars.res.dto';
import { ListBrandResQueryDto } from './models/dto/res/list-brand-query.res.dto';
import { ListCarsQueryResDto } from './models/dto/res/list-cars-query.res.dto';
import { ListModelsResQueryDto } from './models/dto/res/list-models-query.res.dto';
import { CarsMapper } from './service/cars.mapper';
import { CarsService } from './service/cars.service';
// import { CarsDeletedResDto } from './models/dto/res/cars.deleted.res.dto';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(
    private readonly carsService: CarsService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @ApiOperation({
    summary: 'Для створення запису про автомобіль (бренд та модель)',
    description:
      'Користувач з ролью admin та manager, може створити новий запис про автомобіль (бренд та модель)' +
      'Користувач з ролью seller, може повідомити менеджера, ' +
      'про те що не вистачає зазначеної марки автомобіля (бренд та модель).' +
      'Після чого, менеджер буде проінформований на пошту і при необхідності додасть його до списку',
  })
  @Post()
  public async createCars(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarsReqDto,
  ): Promise<CarsResDto | string> {
    if (
      userData.role === RoleTypeEnum.ADMIN ||
      userData.role === RoleTypeEnum.MANAGER
    ) {
      return await this.carsService.createCars(userData, dto);
    }
    if (userData.role === RoleTypeEnum.SELLER) {
      const managers = await this.usersService.findAllManager();
      if (!managers) {
        throw new NotFoundException('No managers found to notify.');
      }
      await Promise.all(
        managers.map((manager) =>
          this.emailService.sendMail(
            EmailTypeEnum.NEW_CAR,
            // 'siroviyn13@gmail.com',
            manager.email, // Пошта менеджера
            {
              name: manager.name, // Ім'я менеджера
              brands_name: dto.brands_name,
              models_name: dto.models_name,
            },
          ),
        ),
      );

      return (
        'The request to add a car has been sent to the manager. ' +
        'The manager will check the information and, if necessary, add a car. ' +
        'Thank you for the signal.'
      );
    }
  }

  @ApiOperation({
    summary: 'Для отримання списку всіх брендів авто',
    description:
      'Користувач може отримати список всіх брендів авто' +
      ' та здійснити пошук по назві бренду' +
      'Доступно для ролей: всі',
  })
  @SkipAuth()
  @Get('all/cars_brands')
  public async findAllBrands(
    @Query() query: ListCarsQueryReqDto, // Параметри передаються через @Query
  ): Promise<ListBrandResQueryDto> {
    const [entities, total] = await this.carsService.findAllBrands(query);
    return CarsMapper.toAllResDtoBrands(entities, total, query);
  }

  @ApiOperation({
    summary: 'Для отримання списку всіх моделей авто',
    description:
      'Користувач може отримати список всіх моделей авто ' +
      'та здійснити пошук по назві моделі' +
      'Доступно для ролей: всі',
  })
  @SkipAuth()
  @Get('all/cars_models')
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
      'та здійснити пошук по: назві бренду та моделі.' +
      'Доступно для ролей: всі',
  })
  @SkipAuth()
  @Get('all')
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
    summary:
      'Для оновлення конкретного запису про автомобіль (бренд та модель) ' +
      'по id бренду до якого підвязана конкретна модель',
    description:
      'Користувач може оновити запис про автомобіль (бренд та модель) ' +
      'Вказавши саме brands_id до якого підвязана конкретна модель. ' +
      'Даний brands_id можна взяти як варіант з cars/all/cars_brands.' +
      'Увага! Для оновлення треба: ' +
      '1.здійснити пошук потрібного нам автомобіля по brands_id; ' +
      '2.вказати обовязково два аргументи brands_name та models_name' +
      'Наприклад якщо була допущена помилка в записі та інше.' +
      'Доступно для ролей: admin, manager',
  })
  @Patch(':carsBrandsId')
  public async updateCars(
    @Param('brands_id', ParseUUIDPipe) brands_id: string,
    @Body() dto: CreateCarsReqDto,
  ): Promise<CarsResDto> {
    return await this.carsService.updateCars(brands_id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.MANAGER, RoleTypeEnum.ADMIN])
  @ApiOperation({
    summary: 'Для видалення автомобіля за його id (бренда та модель)',
    description:
      'Користувач може видалити модель автомобіля по його id (бренд та модель).' +
      '*видаляється повністю в т.ч з БД' +
      'Доступно для ролей: admin, manager',
  })
  @Delete('brands_id/:brands_id')
  public async deleteCars(
    @Param('brands_id', ParseUUIDPipe) brands_id: string,
  ): Promise<string> {
    return await this.carsService.deleteCars(brands_id);
  }
}
