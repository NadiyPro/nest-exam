import { ListUsersQueryReqDto } from '../req/list-users-query.req.dto';
import { UserResDto } from './user.res.dto';

export class ListResQueryDto extends ListUsersQueryReqDto {
  users: UserResDto[];
  // масив постів
  total: number;
  // кількість постів
}
