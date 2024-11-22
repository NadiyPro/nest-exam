import { UserResDto } from '../../../../users/models/dto/res/user.res.dto';
import { TokenPairResDto } from './token_pair.res.dto';

export class AuthResDto {
  tokens: TokenPairResDto;
  user: UserResDto;
}
