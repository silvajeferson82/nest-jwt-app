import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

require('dotenv').config();

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(toEmail: string, token: string): Promise<boolean> {
    const message = {
      to: toEmail,
      from: process.env.MAIL_FROM,
      subject: 'Reset Token App',
      text: token,
      html: `<b>${token}</b>`,
    };

    const response = await this.mailerService
      .sendMail(message)
      .then((response) => {
        console.log(response);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    return response;
  }
}
