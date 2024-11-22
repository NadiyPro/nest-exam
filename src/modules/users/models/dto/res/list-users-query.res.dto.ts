import { ListUsersQueryReqDto } from '../req/list-users-query.req.dto';
import { UserAllResDto } from './users_all.res.dto';

export class ListResQueryDto extends ListUsersQueryReqDto {
  users: UserAllResDto[];
  // масив постів
  total: number;
  // кількість постів
}
