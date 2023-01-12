import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  IsOptional,
} from 'class-validator';
import { RegExHelper } from '../../helpers/regex.helper';
import { MessagesHelper } from 'src/app/helpers/messages.helper';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  reset_password_token?: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password, {
    message: MessagesHelper.PASSWORD_VALID,
  })
  password: string;
}
