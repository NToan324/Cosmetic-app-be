"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.CustomError = void 0;
const http_status_codes_1 = require("http-status-codes");
class CustomError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.status = status;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
class BadRequestError extends CustomError {
    constructor(message = (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.BAD_REQUEST)) {
        super(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends CustomError {
    constructor(message = (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.UNAUTHORIZED)) {
        super(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends CustomError {
    constructor(message = (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.FORBIDDEN)) {
        super(message, http_status_codes_1.StatusCodes.FORBIDDEN);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends CustomError {
    constructor(message = (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.NOT_FOUND)) {
        super(message, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends CustomError {
    constructor(message = (0, http_status_codes_1.getReasonPhrase)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)) {
        super(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.InternalServerError = InternalServerError;
