import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

require('dotenv').config();
console.log(
  `smtp://${process.env.MAIL_USER}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_HOST}`,
);
@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_USER}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_HOST}`,
      // transport: {
      //   host: process.env.MAIL_HOST,
      //   port: 465,
      //   ignoreTLS: true,
      //   secure: true,
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PASSWORD,
      //   },
      // },
    }),
  ],
  exports: [MailerModule],
  providers: [MailService],
})
export class MailModule {}
