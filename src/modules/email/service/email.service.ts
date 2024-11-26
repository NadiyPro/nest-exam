import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';

import { EmailConfig } from '../../../configs/config.type';
import { emailConstants } from '../constants/email.constants';
import { EmailTypeEnum } from '../enums/email.enum';
import { EmailTypeToPayload } from '../types/type_to_payload.type';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: Transporter;
  private userPass: EmailConfig;

  constructor(private readonly configService: ConfigService) {}

  // Метод для асинхронної ініціалізації
  async onModuleInit() {
    this.userPass = this.configService.get<EmailConfig>('email');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      from: 'No reply',
      auth: {
        user: this.userPass.email,
        pass: this.userPass.password,
      },
    });

    await this.initHandlebars();
  }

  private async initHandlebars() {
    // const hbs = await import('nodemailer-express-handlebars');
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
