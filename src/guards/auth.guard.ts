import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from "@nestjs/common";
import { JwtService, TokenExpiredError, JsonWebTokenError } from "@nestjs/jwt";
import { Request } from "express";
import { ILoggedInUserTokenData } from "../interfaces/loggedin-user-token-data";
import { OrchestrationException } from "../exceptions/orchestration.exception";
import { EnumStatusCode } from "../enums/response-status-code";

export const AUTH_GUARD_SECRET = "AUTH_GUARD_SECRET";

export interface AuthenticatedRequest extends Request {
  user: ILoggedInUserTokenData;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(AUTH_GUARD_SECRET) private readonly tokenSecret: string,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new OrchestrationException({
        statusCode: EnumStatusCode.NO_TOKEN_PROVIDED,
        message: "No token provided",
        code: 401,
      });
    }

    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: this.tokenSecret,
      })) as ILoggedInUserTokenData;

      request.user = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new OrchestrationException({
          statusCode: EnumStatusCode.TOKEN_EXPIRED,
          message: "Token has expired",
          code: 401,
        });
      }

      if (error instanceof JsonWebTokenError) {
        throw new OrchestrationException({
          statusCode: EnumStatusCode.INVALID_TOKEN,
          message: "Invalid token",
          code: 401,
        });
      }

      throw new OrchestrationException({
        statusCode: EnumStatusCode.INTERNAL_SERVER_ERROR,
        message: "Authentication failed",
        code: 401,
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
