import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ILoggedInUserTokenData } from "../interfaces/loggedin-user-token-data";
export declare const AUTH_GUARD_SECRET = "AUTH_GUARD_SECRET";
export interface AuthenticatedRequest extends Request {
    user: ILoggedInUserTokenData;
}
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly tokenSecret;
    constructor(jwtService: JwtService, tokenSecret: string);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
