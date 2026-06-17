"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationResult = void 0;
const status_response_1 = require("../enums/status-response");
class OrchestrationResult {
    constructor(input) {
        this.code = input.code;
        this.statusCode = input.statusCode;
        this.message = input.message || null;
        this.data = input.data || null;
    }
    static Success(input) {
        return new OrchestrationResult({
            data: input.data,
            statusCode: input.statusCode,
            code: status_response_1.EnumStatusResponse.SUCCESS,
            message: input.message ?? null,
        });
    }
    static Failure(input) {
        return new OrchestrationResult({
            message: input.message,
            statusCode: input.statusCode,
            code: status_response_1.EnumStatusResponse.FAILURE,
            data: input.data ?? null,
        });
    }
    isSuccess() {
        return this.code === status_response_1.EnumStatusResponse.SUCCESS;
    }
    isFailure() {
        return this.code === status_response_1.EnumStatusResponse.FAILURE;
    }
}
exports.OrchestrationResult = OrchestrationResult;
//# sourceMappingURL=orchestration.result.js.map