import { MetaDataKeys } from '@common/constants/common.constant';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';
import { parseToken } from './string.util';

export function getAccessToken(req: any, keepBearer = false): string {
  const token = req.headers?.['authorization'];

  return keepBearer ? token : parseToken(token);
}

export function setUserData(req: any, userData?: AuthorizeResponse): void {
  req[MetaDataKeys.USER_DATA] = userData;
}
