import { ConfigService } from '@nestjs/config/dist/config.service';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

import { emailConstants } from '../constants/email.constants';
import { EmailTypeEnum } from '../enums/email.enum';
import { EmailTypeToPayload } from '../types/type_to_payload.type';
import { Config, EmailConfig, JwtConfig } from '../../../configs/config.type';

export class EmailService {
  private transporter: Transporter;
  private userPass: EmailConfig;

  constructor(private readonly configService: ConfigService<Config>) {
    this.userPass = this.configService.get('email'); // Перевіряємо, чи змінна існує
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      from: 'No reply',
      auth: {
        user: this.userPass.email, // Перевіряємо, чи змінна існує
        pass: this.userPass.password,
      },
    });

    this.initHandlebars();
  }

  private async initHandlebars() {
    const hbs = await import('nodemailer-express-handlebars');
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

    this.transporter.use('compile', hbs.default(hbsOptions));
  }
  public async sendMail<T extends EmailTypeEnum>(
    type: T,
    to: string,
    context: EmailTypeToPayload[T],
  ): Promise<void> {
    const { subject, template } = emailConstants[type];
    const options = { to, subject, template, context };
    await this.transporter.sendMail(options);
  }
}
