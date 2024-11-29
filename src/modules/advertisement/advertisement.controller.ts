import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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

@ApiTags('Cars')
@Controller('cars')
export class AvertisementController {
  constructor(
    private readonly carsService: CarsService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly advertisementJSONService: AdvertisementJSONService,
  ) {}
  //
  // @ApiBearerAuth()
  // @UseGuards(ApprovedRoleGuard)
  // @Role([RoleTypeEnum.ADMIN])
  // @ApiOperation({
  //   summary: 'Завантажити з файлу JSON автомобілі для тестування',
  //   description:
  //     'Користувач з ролью admin може завантажити з файлу JSON автомобілі для тестування' +
  //     'Доступно для ролей: admin',
  // })
  // @Post('import')
  // async importCarsJSON(@CurrentUser() userData: IUserData): Promise<string> {
  //   await this.advertisementJSONService.v(userData.userId);
  //   return 'Car data has been successfully imported into the database.';
  // }
}
