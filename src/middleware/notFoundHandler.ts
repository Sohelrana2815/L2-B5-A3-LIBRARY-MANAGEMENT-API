import { NextFunction, Request, RequestHandler, Response } from "express";

export const notFoundHandler: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    message: "Not found",
    success: false,
    error: null,
  });
};
