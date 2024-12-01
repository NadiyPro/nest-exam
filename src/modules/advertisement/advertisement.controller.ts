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
import { IUserData } from '../auth/models/interfaces/user_data.interface';
import { CreateCarsReqDto } from '../cars/models/dto/req/create_cars.req.dto';
import { CarsResDto } from '../cars/models/dto/res/cars.res.dto';
import { CarsService } from '../cars/service/cars.service';
import { EmailService } from '../email/service/email.service';
import { ApprovedRoleGuard } from '../guards/approved_role.guard';
import { Role } from '../guards/decorator/role.decorator';
import { RoleTypeEnum } from '../users/enums/RoleType.enum';
import { UsersService } from '../users/service/users.service';
import { AdvertisementJSONService } from './advertisementJSON/service/advertisementJSON.service';
import { AdvertisementReqDto } from './models/dto/req/advertisement.req.dto';
import { AdvertisementResDto } from './models/dto/res/advertisement.res.dto';
import { IAdvertisemen } from './models/interface/user_advertisemen.interface';
import { AdvertisementService } from './service/advertisement.service';

@ApiTags('Advertisement')
@Controller('advertisement')
export class AvertisementController {
  constructor(
    private readonly carsService: CarsService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly advertisementService: AdvertisementService,
    private readonly advertisementJSONService: AdvertisementJSONService,
  ) {}

  @ApiOperation({
    summary: 'Для завантаження оголошення про продаж автомобіля',
    description:
      'Користувач може завантажити оголошення про продаж автомобіля. ' +
      'Увага! Продавець з типом акаунту basic може завантажити лише одне оголошення, ' +
      'для акаунту premium - кількість оголошень не обмежена. ' +
      '*Менеджеру надходить лист на пошту для перевірки оголошення, ' +
      'якщо в ньому потенційно є некоректний/нецензурний текст. ' +
      'При цьому, на ча перевірки оголошення переходить в статус - pending. ' +
      'Після перевірки тексту оголошення менеджером, статус зміниться на active або inactive відповідно.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @Post('me/advertisement')
  public async createAdvertisement(
    @CurrentUser() userData: IAdvertisemen,
    @Body() adReqDto: AdvertisementReqDto,
  ): Promise<AdvertisementResDto> {
    return await this.advertisementService.createAdvertisement(
      userData,
      adReqDto,
    );
  }

  @ApiOperation({
    summary: 'Для виванатження своїх оголошень',
    description:
      'Користувач може вивантажити всі свої оголошення.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @Get('me')
  public async findAdvertisementMe(@CurrentUser() userData: IUserData) {
    return await this.advertisementService.findfindAdvertisementMe(userData);
  }

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @ApiOperation({
    summary: 'Для видалення свого оголошення по id',
    description:
      'Користувач може видалити своє оголошення по його id.' +
      '*видаляється повністю в т.ч з БД' +
      'Доступно для ролей: admin, manager, seller',
  })
  @Delete('me/:advertisemenId')
  public async deleteAdvertisement(
    @CurrentUser() userData: IAdvertisemen,
    @Param('advertisemenId') advertisementId: string,
  ): Promise<string> {
    return await this.advertisementService.deleteAdvertisement(
      userData,
      advertisementId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  @ApiOperation({
    summary: 'Для редагування свого оголошення по id. ',
    description:
      'Користувач може відредагувати своє оголошення по id в своєму оголошені: текст, суму та валюту.' +
      'Увага! Якщо користувач редагує повідомлення три рази, ' +
      'то менеджеру надходить лист на пошту, про необхідність перевірити дане оголошення. ' +
      'На час перевірки, оголошення змінює свій статус на - pending. ' +
      'Після перевірки тексту оголошення менеджером, статус зміниться на active або inactive відповідно.' +
      'Доступно для ролей: admin, manager',
  })
  @Patch(':carsBrandsId')
  public async updateCars(
    @Param('brands_id', ParseUUIDPipe) brands_id: string,
    @Body() dto: CreateCarsReqDto,
  ): Promise<CarsResDto> {
    return await this.carsService.updateCars(brands_id, dto);
  }

  @ApiOperation({
    summary: 'Для виванатження оголошення по його id',
    description:
      'Користувач може вивантажити оголошення по його id.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  @Get(':advertisementId')
  public async findAdvertisementID(
    @Param('advertisemenId') advertisementId: string,
  ) {
    return await this.advertisementService.findfindAdvertisementId(
      advertisementId,
    );
  }

  // @ApiBearerAuth()
  // @UseGuards(ApprovedRoleGuard)
  // @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  // @ApiOperation({
  //   summary:
  //     'Для оновлення конкретного запису про автомобіль (бренд та модель) ' +
  //     'по id бренду до якого підвязана конкретна модель',
  //   description:
  //     'Користувач може оновити запис про автомобіль (бренд та модель) ' +
  //     'Вказавши саме brands_id до якого підвязана конкретна модель. ' +
  //     'Даний brands_id можна взяти як варіант з cars/all/cars_brands.' +
  //     'Увага! Для оновлення треба: ' +
  //     '1.здійснити пошук потрібного нам автомобіля по brands_id; ' +
  //     '2.вказати обовязково два аргументи brands_name та models_name' +
  //     'Наприклад якщо була допущена помилка в записі та інше.' +
  //     'Доступно для ролей: admin, manager',
  // })
  // @Patch(':carsBrandsId')
  // public async updateCars(
  //   @Param('brands_id', ParseUUIDPipe) brands_id: string,
  //   @Body() dto: CreateCarsReqDto,
  // ): Promise<CarsResDto> {
  //   return await this.carsService.updateCars(brands_id, dto);
  // }

  @ApiOperation({
    summary: 'Для виванатження оголошення по його id',
    description:
      'Користувач може вивантажити оголошення по його id.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER])
  @Get(':advertisementId')
  public async deleteAdvertisementId(
    @Param('advertisemenId') advertisementId: string,
  ) {
    return await this.advertisementService.deleteAdvertisementId(
      advertisementId,
    );
  }

  @ApiOperation({
    summary: 'Для завантаження фото автомобіля користувачем для оголошення',
    description:
      'Користувач може завантажити фото автомобіля для оголошення.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_cars'))
  @ApiFile('image_cars', true, true)
  @Post('me/image_cars/:advertisementId')
  public async uploadImageCars(
    @Param('advertisementId') advertisementId: string,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<void> {
    await this.advertisementService.uploadImageCars(advertisementId, file);
  }

  @ApiOperation({
    summary: 'Для видалення фото автомобіля користувачем для оголошення',
    description:
      'Користувач може видалити фото автомобіля для оголошення.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @Delete('me/image_cars/:advertisemenId')
  public async deleteAvatar(
    @Param('advertisemenId') advertisementId: string,
  ): Promise<void> {
    await this.advertisementService.deleteImageCars(advertisementId);
  }
}
