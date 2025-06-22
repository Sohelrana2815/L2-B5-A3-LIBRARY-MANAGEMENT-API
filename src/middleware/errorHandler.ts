// src/middleware/errorHandler.ts
import { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import { ApiError } from "../utils/ApiError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Mongoose ValidationError
  if (err instanceof MongooseError.ValidationError) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: err.name,
        errors: err.errors,
      },
    });
    return;
  }

  // Duplicate-key error (e.g. unique ISBN)
  if (typeof err === "object" && err !== null && (err as any).code === 11000) {
    res.status(409).json({
      message: "Duplicate key error",
      success: false,
      error: {
        name: "MongoError",
        errors: (err as any).keyValue,
      },
    });
    return;
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      success: false,
      error: err.error ?? null,
    });
    return;
  }

  // Fallback for unexpected errors
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
    success: false,
    error: {
      name: "InternalError",
      errors: {},
    },
  });
};
