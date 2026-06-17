"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OrchestrationExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const orchestration_exception_1 = require("../exceptions/orchestration.exception");
const status_response_1 = require("../enums/status-response");
const response_status_code_1 = require("../enums/response-status-code");
let OrchestrationExceptionFilter = OrchestrationExceptionFilter_1 = class OrchestrationExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(OrchestrationExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        console.log(exception);
        if (exception instanceof orchestration_exception_1.OrchestrationException) {
            this.logger.warn(`[OrchestrationException] ${request.method} ${request.url} — ${exception.message}`);
            return response.status(exception.code).json({
                code: status_response_1.EnumStatusResponse.FAILURE,
                statusCode: exception.statusCode,
                message: exception.message,
                data: null,
            });
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            this.logger.warn(`[HttpException] ${request.method} ${request.url} — ${exception.message}`);
            return response.status(status).json({
                code: status_response_1.EnumStatusResponse.FAILURE,
                statusCode: response_status_code_1.EnumStatusCode.INTERNAL_SERVER_ERROR,
                message: exception.message,
                data: null,
            });
        }
        this.logger.error(`[UnhandledException] ${request.method} ${request.url}`, exception instanceof Error ? exception.stack : String(exception));
        return response.status(500).json({
            code: status_response_1.EnumStatusResponse.FAILURE,
            statusCode: response_status_code_1.EnumStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.OrchestrationExceptionFilter = OrchestrationExceptionFilter;
exports.OrchestrationExceptionFilter = OrchestrationExceptionFilter = OrchestrationExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], OrchestrationExceptionFilter);
//# sourceMappingURL=exception.filter.js.map