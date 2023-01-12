import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

require('dotenv').config();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_USER}:${process.env.MAIL_APY_KEY}@${process.env.MAIL_HOST}`,
    }),
  ],
  exports: [MailerModule],
  providers: [MailService],
})
export class MailModule {}
