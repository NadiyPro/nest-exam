import {
  Body,
  Controller,
  Delete,
  Param,
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
  @Post('me/image_cars/:advertisemenId')
  public async uploadImageCars(
    @Param('advertisemenId') advertisemenId: string,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<void> {
    await this.advertisemenService.uploadImageCars(advertisemenId, file);
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
    @Param('advertisemenId') advertisemenId: string,
  ): Promise<void> {
    await this.advertisemenService.deleteImageCars(advertisemenId);
  }
}
