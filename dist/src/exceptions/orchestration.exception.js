"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationException = void 0;
const common_1 = require("@nestjs/common");
const response_status_code_1 = require("../enums/response-status-code");
class OrchestrationException extends common_1.HttpException {
    constructor({ code = 400, message, statusCode = response_status_code_1.EnumStatusCode.INTERNAL_SERVER_ERROR, }) {
        super(message, code);
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.OrchestrationException = OrchestrationException;
//# sourceMappingURL=orchestration.exception.js.map