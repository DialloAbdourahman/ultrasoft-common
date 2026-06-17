"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = exports.AUTH_GUARD_SECRET = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const orchestration_exception_1 = require("../exceptions/orchestration.exception");
const response_status_code_1 = require("../enums/response-status-code");
exports.AUTH_GUARD_SECRET = "AUTH_GUARD_SECRET";
let AuthGuard = class AuthGuard {
    constructor(jwtService, tokenSecret) {
        this.jwtService = jwtService;
        this.tokenSecret = tokenSecret;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new orchestration_exception_1.OrchestrationException({
                statusCode: response_status_code_1.EnumStatusCode.NO_TOKEN_PROVIDED,
                message: "No token provided",
                code: 401,
            });
        }
        try {
            const payload = (await this.jwtService.verifyAsync(token, {
                secret: this.tokenSecret,
            }));
            request.user = payload;
        }
        catch (error) {
            if (error instanceof jwt_1.TokenExpiredError) {
                throw new orchestration_exception_1.OrchestrationException({
                    statusCode: response_status_code_1.EnumStatusCode.TOKEN_EXPIRED,
                    message: "Token has expired",
                    code: 401,
                });
            }
            if (error instanceof jwt_1.JsonWebTokenError) {
                throw new orchestration_exception_1.OrchestrationException({
                    statusCode: response_status_code_1.EnumStatusCode.INVALID_TOKEN,
                    message: "Invalid token",
                    code: 401,
                });
            }
            throw new orchestration_exception_1.OrchestrationException({
                statusCode: response_status_code_1.EnumStatusCode.INTERNAL_SERVER_ERROR,
                message: "Authentication failed",
                code: 401,
            });
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(exports.AUTH_GUARD_SECRET)),
    __metadata("design:paramtypes", [jwt_1.JwtService, String])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map