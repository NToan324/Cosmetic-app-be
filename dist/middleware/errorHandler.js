"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const error_response_1 = require("@/core/error.response");
class ErrorHandler {
    static notFoundError(req, res, next) {
        next(new error_response_1.NotFoundError());
    }
    static globalError(err, req, res, next) {
        res.status(err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: {
                message: err.message || 'Internal Server Error',
                statusCode: err.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR
            }
        });
    }
}
exports.default = ErrorHandler;
