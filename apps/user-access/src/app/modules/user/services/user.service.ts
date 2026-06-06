import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createUserRequestMapping } from '../mappers';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(param: CreateUserTcpRequest) {
    const isExists = await this.userRepository.exists(param.email);

    if (isExists) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const input = createUserRequestMapping(param);

    return this.userRepository.create(input);
  }
}
