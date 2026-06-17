import { TCP_SERVICES } from '@common/configuration/lib/tcp.config';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateKeycloakUserTcpReq } from '@common/interfaces/tcp/authorizer';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { createUserRequestMapping } from '../mappers';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
  ) {}

  async create(param: CreateUserTcpRequest, processId: string) {
    const { email, password, firstName, lastName } = param;
    const isExists = await this.userRepository.exists(email);

    if (isExists) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const userId = await this.createKeycloakUser({ email, password, firstName, lastName }, processId);

    const input = createUserRequestMapping(param, String(userId));

    return this.userRepository.create(input);
  }

  createKeycloakUser(data: CreateKeycloakUserTcpReq, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<string>(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }

  async getUserByUserId(userId: string) {
    const user = await this.userRepository.getByUserId(userId);

    if (!user) {
      throw new NotFoundException(ERROR_CODE.USER_NOT_FOUND);
    }

    return user;
  }
}
