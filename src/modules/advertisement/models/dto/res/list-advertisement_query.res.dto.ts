import { ListAdQueryReqDto } from '../req/list-advertisement_query.req.dto';
import { AdvertisementMeResDto } from './advertisement_me.res.dto';

export class ListAdAllQueryResDto extends ListAdQueryReqDto {
  advertisement: AdvertisementMeResDto[];
  total: number;
}
