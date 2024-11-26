import { EmailTypeEnum } from '../enums/email.enum';
import { EmailPayloadCombined } from './email_payload.type';
import { PickRequired } from './pick-required.type';

export type EmailTypeToPayload = {
  [EmailTypeEnum.NEW_CAR]: PickRequired<
    EmailPayloadCombined,
    'name' | 'brands_name' | 'models_name'
  >;

  [EmailTypeEnum.TEXT_AD]: PickRequired<
    EmailPayloadCombined,
    'name' | 'user_id' | 'text_advertisement'
  >;
};
