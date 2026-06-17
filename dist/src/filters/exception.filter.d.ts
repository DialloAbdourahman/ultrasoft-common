import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class OrchestrationExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): any;
}
