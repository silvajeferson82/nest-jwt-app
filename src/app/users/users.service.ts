import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository, FindOptionsWhere } from 'typeorm';
import { UsersEntity } from './entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
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
  // async findOneOrFail(
  //   conditions?: FindOptionsWhere<UsersEntity>,
  //   options?: FindOneOptions<UsersEntity>,
  // ) {
  //   try {
  //     return await this.usersRepository.findOneOrFail(conditions, options);
  //   } catch (error) {
  //     throw new NotFoundException(error.message);
  //   }
  // }

  async store(data: CreateUserDto) {
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
}
