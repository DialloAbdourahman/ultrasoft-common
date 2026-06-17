import { HttpException } from '@nestjs/common';
import { EnumStatusCode } from '../enums/response-status-code';
export declare class OrchestrationException extends HttpException {
    readonly code: number;
    readonly statusCode: EnumStatusCode;
    constructor({ code, message, statusCode, }: {
        statusCode: EnumStatusCode;
        message: string;
        code?: number;
    });
}
