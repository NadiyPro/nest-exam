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
import { IUserData } from '../auth/models/interfaces/user_data.interface';
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
    summary: 'Для завантаження оголошення про продаж автомобіля',
    description:
      'Користувач може завантажити оголошення про продаж автомобіля. ' +
      'Увага! Продавець з типом акаунту basic може завантажити лише одне оголошення, ' +
      'для акаунту premium - кількість оголошень не обмежена. ' +
      '*Менеджеру надходить лист на пошту для перевірки оголошення, ' +
      'якщо в ньому потенційно є некоректний/нецензурний текст.' +
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
    return await this.advertisemenService.createAdvertisement(
      userData,
      adReqDto,
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
  @Post('me/image_cars')
  public async uploadImageCars(
    @CurrentUser() userData: IUserData,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    console.log(userData.role);
    await this.advertisemenService.uploadImageCars(userData, file);
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
