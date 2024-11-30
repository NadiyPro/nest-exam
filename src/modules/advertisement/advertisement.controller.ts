import {
  Body,
  Controller,
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
    private readonly advertisemenService: AdvertisementService,
    private readonly advertisementJSONService: AdvertisementJSONService,
  ) {}

  @ApiOperation({
    summary: 'Для завантаження avatar користувачем у свій обліковий запис',
    description:
      'Користувач може завантажити avatar у свій обліковий запис.' +
      'Доступно для ролей: admin, manager, seller',
  })
  @ApiBearerAuth()
  @UseGuards(ApprovedRoleGuard)
  @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('image_cars'))
  // @ApiFile('image_cars', false, true)
  @Post('me/advertisement')
  public async createAdvertisement(
    @CurrentUser() userData: IAdvertisemen,
    @Body() adReqDto: AdvertisementReqDto,
    // @UploadedFile() file: Express.Multer.File,
  ): Promise<AdvertisementResDto> {
    // const rates = this.advertisementJSONService.readJSON();
    //
    // // Створюємо об'єкт AdvertisementEntity (наприклад, якщо є дані за замовчуванням)
    // const ad = new AdvertisementEntity();
    // ad.original_currency = adReqDto.original_currency;
    // ad.price = adReqDto.price;

    // Виклик сервісу з усіма аргументами
    return await this.advertisemenService.createAdvertisement(
      userData,
      adReqDto,
      // file,
      // ad,
      // rates,
    );
    // @ApiOperation({
    //   summary: 'Для завантаження avatar користувачем у свій обліковий запис',
    //   description:
    //     'Користувач може завантажити avatar у свій обліковий запис.' +
    //     'Доступно для ролей: admin, manager, seller',
    // })
    // @ApiBearerAuth()
    // @UseGuards(ApprovedRoleGuard)
    // @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
    // @ApiConsumes('multipart/form-data')
    // @UseInterceptors(FileInterceptor('image_cars'))
    // @ApiFile('image_cars', false, true)
    // @Post('me/image_cars')
    // public async createAdvertisement(
    //   @CurrentUser() userData: IAdvertisemen,
    //   @Body() adReqDto: AdvertisementReqDto,
    //   @UploadedFile() file: Express.Multer.File,
    // ): Promise<AdvertisementResDto> {
    //   // const rates = this.advertisementJSONService.readJSON();
    //   //
    //   // // Створюємо об'єкт AdvertisementEntity (наприклад, якщо є дані за замовчуванням)
    //   // const ad = new AdvertisementEntity();
    //   // ad.original_currency = adReqDto.original_currency;
    //   // ad.price = adReqDto.price;
    //
    //   // Виклик сервісу з усіма аргументами
    //   return await this.advertisemenService.createAdvertisement(
    //     userData,
    //     adReqDto,
    //     file,
    //     // ad,
    //     // rates,
    //   );
    // const rates = this.advertisementJSONService.readJSON();
    //
    // // Створюємо об'єкт AdvertisementEntity (наприклад, якщо є дані за замовчуванням)
    // const ad = new AdvertisementEntity();
    // ad.original_currency = adReqDto.original_currency;
    // ad.price = adReqDto.price;
    //
    // // Виклик сервісу з усіма аргументами
    // return await this.advertisemenService.createAdvertisement(
    //   userData,
    //   adReqDto,
    //   file,
    //   ad,
    //   rates,
    // );
  }
}

// @ApiOperation({
//   summary: 'Для видалення avatar користувачем із свого облікового запису',
//   description:
//     'Користувач може видалити avatar із свого облікового запису.' +
//     'Доступно для ролей: admin, manager, seller',
// })
// @ApiBearerAuth()
// @UseGuards(ApprovedRoleGuard)
// @Role([RoleTypeEnum.ADMIN, RoleTypeEnum.MANAGER, RoleTypeEnum.SELLER])
// @Delete('me/avatar')
// public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
//   await this.usersService.deleteAvatar(userData);
// }
