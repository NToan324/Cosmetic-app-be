"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoContentResponse = exports.CreatedResponse = exports.OkResponse = exports.SuccessResponse = void 0;
const http_status_codes_1 = require("http-status-codes");
class SuccessResponse {
    message;
    status;
    data;
    constructor(message, status, data) {
        this.message = message;
        this.status = status;
        this.data = data;
        this.message = message;
        this.status = status;
        this.data = data;
    }
}
exports.SuccessResponse = SuccessResponse;
class OkResponse extends SuccessResponse {
    constructor(message = (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.OK), data) {
        super(message, http_status_codes_1.StatusCodes.OK, data);
    }
}
exports.OkResponse = OkResponse;
class CreatedResponse extends SuccessResponse {
    constructor(message = (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.CREATED), data) {
        super(message, http_status_codes_1.StatusCodes.CREATED, data);
    }
}
exports.CreatedResponse = CreatedResponse;
class NoContentResponse extends SuccessResponse {
    constructor(message = (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NO_CONTENT), data) {
        super(message, http_status_codes_1.StatusCodes.NO_CONTENT, data);
    }
}
exports.NoContentResponse = NoContentResponse;
