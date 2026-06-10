import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { User } from '@common/schemas/user.schema';
import { ObjectId } from 'mongodb';

export const createUserRequestMapping = (data: CreateUserTcpRequest, userId: string): Partial<User> => {
  return {
    ...data,
    role: data.roles.map((role) => new ObjectId(role)),
    userId,
  };
};
