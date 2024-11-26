// import { EmailTypeToPayload } from '../types/email-type-to-payload.type';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';

import { Config } from '../../../configs/config.type';

export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService<Config>) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      from: 'No reply',
      auth: {
        user: this.configService.get('email'),
        pass: this.configService.get('email'),
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(
          process.cwd(),
          'src',
          'modules',
          'email',
          'templates',
          'layouts',
        ),
        partialsDir: path.join(
          process.cwd(),
          'src',
          'modules',
          'email',
          'templates',
          'partials',
        ),
      },
      viewPath: path.join(
        process.cwd(),
        'src',
        'modules',
        'email',
        'templates',
        'views',
      ),
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(hbsOptions));
  }

  // public async sendMail<T extends EmailTypeEnum>(
  //   type: T,
  //   to: string,
  //   context: EmailTypeToPayload[T],
  // ): Promise<void> {
  //   const { subject, template } = emailConstants[type];
  //
  //   context['frontUrl'] = configService.APP_FRONT_URL;
  //   // тут ми вказуємо, що в нас буде змінна frontUrl,
  //   // яка буде дорівнювати нашому хост (http://localhost:3001)
  //   // *хост беремо з .env
  //   const options = { to, subject, template, context };
  //   await this.transporter.sendMail(options);
  // }
}
