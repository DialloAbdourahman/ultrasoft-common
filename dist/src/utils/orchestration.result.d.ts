import { EnumStatusCode } from '../enums/response-status-code';
import { EnumStatusResponse } from '../enums/status-response';
export declare class OrchestrationResult<T = unknown> {
    readonly code: EnumStatusResponse;
    readonly statusCode: EnumStatusCode;
    readonly message: string | null;
    readonly data: T | null;
    private constructor();
    static Success<T>(input: {
        statusCode: EnumStatusCode;
        data: T;
        message?: string | null;
    }): OrchestrationResult<T>;
    static Failure<T>(input: {
        message: string;
        statusCode: EnumStatusCode;
        data?: T | null;
    }): OrchestrationResult<T>;
    isSuccess(): boolean;
    isFailure(): boolean;
}
