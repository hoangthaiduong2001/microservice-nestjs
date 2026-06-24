import { GRPC_SERVICES } from '@common/configuration/lib/grpc.config';
import { UserAccessService } from '@common/interfaces/grpc/user-access';
import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Role } from '@common/schemas/role.schema';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import JwksRsa, { JwksClient } from 'jwks-rsa';
import { firstValueFrom, map } from 'rxjs';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';

@Injectable()
@Injectable()
export class AuthorizerService {
  private userAccessService: UserAccessService;
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
    @Inject(GRPC_SERVICES.USER_ACCESS_SERVICE) private readonly grpcUserAccessClient: ClientGrpc,
  ) {
    const host = this.configService.get('KEYCLOAK_CONFIG.HOST');
    const realm = this.configService.get('KEYCLOAK_CONFIG.REALM');

    this.jwksClient = JwksRsa({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  onModuleInit() {
    this.userAccessService = this.grpcUserAccessClient.getService<UserAccessService>('UserAccessService');
  }

  async login(params: LoginTcpRequest) {
    const { username, password } = params;

    const { access_token: accessToken, refresh_token: refreshToken } = await this.keycloakHttpService.exchangeUserToken(
      { username, password },
    );

    return { accessToken, refreshToken };
  }

  async verifyUserToken(token: string): Promise<AuthorizeResponse> {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;

      const user = await this.userValidation(String(payload.sub));

      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: (user.role as unknown as Role[]).map((role) => role.permission).flat(),
          user,
          userId: user.id,
        },
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async userValidation(userId: string) {
    const user = await firstValueFrom(this.userAccessService.getByUserId({ userId }).pipe(map((data) => data.data)));
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
