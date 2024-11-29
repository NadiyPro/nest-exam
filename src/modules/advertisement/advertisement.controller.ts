import { Controller, Delete, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current_user.decorator';
import { IUserData } from '../auth/models/interfaces/user_data.interface';
import { CarsJSONService } from '../cars/carsJSON/service/carsJSON.service';
import { CarsService } from '../cars/service/cars.service';
import { EmailService } from '../email/service/email.service';
import { ApprovedRoleGuard } from '../guards/approved_role.guard';
import { Role } from '../guards/decorator/role.decorator';
import { RoleTypeEnum } from '../users/enums/RoleType.enum';
import { UsersService } from '../users/service/users.service';
import { AdvertisementJSONService } from './advertisementJSON/service/advertisementJSON.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../../common/decorators/api-file.decorator';

@ApiTags('Advertisement')
@Controller('advertisement')
export class AvertisementController {
  constructor(
    private readonly carsService: CarsService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
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
}
