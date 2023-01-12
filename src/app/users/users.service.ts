import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { Repository, EntityNotFoundError } from 'typeorm';
import { UsersEntity } from './entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes } from 'crypto';
import { MessagesHelper } from '../helpers/messages.helper';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly mailService: MailService,
  ) {}

  async findAll() {
    return await this.usersRepository.find({
      select: ['id', 'firstName', 'lastName', 'email'],
    });
  }

  async findOneOrFail(id?: string, email?: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { id, email },
        select: ['id', 'firstName', 'lastName', 'email', 'password'],
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async store(data: CreateUserDto) {
    const { email } = data;
    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (!!userExists) {
      throw new HttpException(MessagesHelper.USER_EXISTS, 400);
    }
    const user = this.usersRepository.create(data);
    return await this.usersRepository.save(user);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.usersRepository.findOneByOrFail({ id });
    this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  async destroy(id: string) {
    await this.usersRepository.findOneByOrFail({ id });
    this.usersRepository.softDelete({ id });
  }

  async createResetToken(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(MessagesHelper.USER_NOT_FOUND, 404);
    }

    const hash = randomBytes(32).toString('hex');
    user.reset_password_token = hash;

    const updatedHash = await this.usersRepository.update(user.id, user);
    if (!updatedHash.affected) {
      throw new EntityNotFoundError(UsersEntity, email);
    }

    const updatedUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    const { reset_password_token } = updatedUser;

    const emailToken = await this.mailService.sendMail(
      email,
      reset_password_token,
    );
    if (!emailToken) {
      throw new HttpException(MessagesHelper.RESET_TOKEN_ERROR, 400);
    }

    return { message: MessagesHelper.RESET_TOKEN_SUCCESS };
  }
}
