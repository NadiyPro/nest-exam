import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CarsService } from '../cars/service/cars.service';
import { EmailService } from '../email/service/email.service';
import { ApprovedRoleGuard } from '../guards/approved_role.guard';
import { Role } from '../guards/decorator/role.decorator';
import { RoleTypeEnum } from '../users/enums/RoleType.enum';
import { UsersService } from '../users/service/users.service';
import { AdvertisementJSONService } from './advertisementJSON/service/advertisementJSON.service';
import { RoleCount } from './guards/decorator/role_seller.decorator';
import { AdvertisementReqDto } from './models/dto/req/advertisement.req.dto';
import { ListAdQueryReqDto } from './models/dto/req/list-advertisement_query.req.dto';
import { UpdateAdMeReqDto } from './models/dto/req/update_advertisement.req.dto';
import { AdvertisementResDto } from './models/dto/res/advertisement.res.dto';
import { AdvertisementMeResDto } from './models/dto/res/advertisement_me.res.dto';
import { ListAdAllQueryResDto } from './models/dto/res/list-advertisement_query.res.dto';
import { IAdvertisemen } from './models/interface/user_advertisemen.interface';
import { AdvertisementMapper } from './service/advertisement.mapper';
import { AdvertisementService } from './service/advertisement.service';
import { UserRepository } from '../../infrastructure/repository/services/user.repository';
import { CarsBrandsRepository } from '../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../infrastructure/repository/services/cars_models.repository';

@ApiTags('Advertisement')
@Controller('advertisement')
export class AvertisementController {
  constructor(
    private readonly carsService: CarsService,
    private readonly emailService: EmailService,
    private readonly advertisementMapper: AdvertisementMapper,
    private readonly advertisementService: AdvertisementService,
    private readonly userRepository: UserRepository,
    private readonly carsBrandsRepository: CarsBrandsRepository,
    private readonly carsModelsRepository: CarsModelsRepository,
    private readonly advertisementJSONService: AdvertisementJSONService,
  ) {
    this.advertisementMapper = new AdvertisementMapper(
      this.userRepository,
      this.carsBrandsRepository,
      this.carsModelsRepository,
    );
  }

  @ApiOperation({
    summary: 'Для завантаження оголошення про продаж автомобіля',
    description:
      'Користувач може завантажити оголошення про продаж автомобіля. ' +
      'Увага! Продавець з типом акаунту basic може завантажити лише одне оголошення, ' +
      'для акаунту premium - кількість оголошень не обмежена. ' +
      '*Всі всі оголошення проходять перевірку на коректність/цензуру тексту, ' +
      'тому за замовченням встановлено статус - pending. ' +
      'Якщо автоматично не буде виявлено некоректного/нецензурного тексту, то статус зміниться на active. ' +
      'Якщо в оголошені буде виявлено підозрілий текст, ' +
      'то користувачу буде відображено рекомендацію відредагувати текст через потенційно нейприйнятні слова/фрази.' +
      'Після даного повідомлення користувач може відредагувати текст в своєму оголошення три рази, ' +
      'якщо три рази користувачу видавалась помилка з рекомендацією про редагування, ' +
      'то оголошення переходить в статус - inactive, ' +
      'а менеджеру надходить лист для перевірки тексту даного оголошення.' +
      'Після перевірки тексту менеджером, статус зміниться на active або inactive відповідно.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @RoleCount([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  // @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  @Post()
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
    summary: 'Для отримання інформацію про всі оголошення',
    description:
      'Користувач може отримати інформацію про всі оголошення' +
      ' та здійснити пошук по бренду, моделі та name продавця. ' +
      'Доступно для ролей: всім',
  })
  @SkipAuth()
  @Get('all')
  public async findAdvertisementAll(
    @Query() query: ListAdQueryReqDto,
  ): Promise<ListAdAllQueryResDto> {
    const [entities, total] =
      await this.advertisementService.findAdvertisementAll(query);
    return await this.advertisementMapper.toAllAdResDtoList(
      entities,
      total,
      query,
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
  public async deleteAdvertisementMe(
    @CurrentUser() userData: IAdvertisemen,
    @Param('advertisemenId') advertisementId: string,
  ): Promise<string> {
    return await this.advertisementService.deleteAdvertisementMe(
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
      'Увага! Якщо користувач редагує текст оголошення три рази і ' +
      'воно не проходить валідацію через потенційно неприйнятні слова/фрази,' +
      'то оголошення переходить в статус - inactive,' +
      'а менеджеру надходить лист для перевірки тексту даного оголошення.' +
      'Після перевірки тексту менеджером, статус зміниться на active або inactive відповідно.' +
      'Доступно для ролей: admin, manager',
  })
  @Patch('me/:carsBrandsId')
  public async updateAdvertisementMe(
    @CurrentUser() userData: IAdvertisemen,
    @Param('advertisemenId') advertisementId: string,
    @Body() dto: UpdateAdMeReqDto,
  ): Promise<AdvertisementMeResDto> {
    return await this.advertisementService.updateAdvertisementMe(
      userData,
      advertisementId,
      dto,
    );
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
  @ApiFile('image_cars', false, true)
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
