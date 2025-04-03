import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError, NotFoundError } from "../core/error.response";

export default class ErrorHandler {
  static notFoundError(req: Request, res: Response, next: NextFunction) {
    next(new NotFoundError());
  }

  static globalError(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: err.message || "Internal Server Error",
        statusCode: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
