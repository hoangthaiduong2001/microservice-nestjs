import { GRPC_SERVICES } from '@common/configuration/lib/grpc.config';
import { MetaDataKeys } from '@common/constants/common.constant';
import { AuthorizerService } from '@common/interfaces/grpc/authorizer';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';
import { getAccessToken, setUserData } from '@common/utils/request.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  private authorizerService: AuthorizerService;

  constructor(
    private readonly reflector: Reflector,

    @Inject(CACHE_MANAGER) private changeManager: Cache,
    @Inject(GRPC_SERVICES.AUTHORIZER_SERVICE) private readonly grpcAuthorizerClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authorizerService = this.grpcAuthorizerClient.getService<AuthorizerService>('AuthorizerService');
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authOption = this.reflector.get<{ secured: boolean }>(MetaDataKeys.SECURED, context.getHandler());

    const req = context.switchToHttp().getRequest();

    if (!authOption?.secured) {
      return true;
    }
    return this.verifyToken(req);
  }

  private async verifyToken(req: any): Promise<boolean> {
    try {
      const token = getAccessToken(req);
      const cacheKey = this.generateTokenCacheKey(token);
      const processId = req[MetaDataKeys.PROCESS_ID];

      const cacheData = await this.changeManager.get<AuthorizeResponse>(cacheKey);

      if (cacheData) {
        setUserData(req, cacheData);
        return true;
      }

      const response = await firstValueFrom(this.authorizerService.verifyUserToken({ token }));

      const { data: result } = response;

      if (!result?.valid) {
        throw new UnauthorizedException('Token is invalid');
      }
      setUserData(req, result);
      this.changeManager.set(cacheKey, result, 30 * 60 * 1000);
      return true;
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Token is invalid');
    }
  }

  generateTokenCacheKey(token: string): string {
    const hash = createHash('sha256').update(token).digest('hex');
    return `user-token:${hash}`;
  }
}
