import { EmailTypeEnum } from '../enums/email.enum';

export const emailConstants = {
  [EmailTypeEnum.NEW_CAR]: {
    subject: 'The user offers to add a new car',
    template: 'new_car',
  },
  [EmailTypeEnum.TEXT_AD]: {
    subject: 'Potentially incorrect/obscene ad text',
    template: 'text_ad',
  },
};
