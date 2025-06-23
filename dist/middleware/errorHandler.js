"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = require("mongoose");
const ApiError_1 = require("../utils/ApiError");
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    var _a;
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: err.name, // "ZodError"
                errors: err.errors, // ZodIssue[]
            },
        });
        return;
    }
    if (err instanceof mongoose_1.Error.CastError) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: err.name,
                errors: {
                    [err.path]: {
                        message: err.message,
                        name: err.name,
                        kind: err.kind,
                        path: err.path,
                        value: err.value,
                    },
                },
            },
        });
        return;
    }
    // Mongoose ValidationError
    if (err instanceof mongoose_1.Error.ValidationError) {
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
    if (typeof err === "object" && err !== null && err.code === 11000) {
        res.status(409).json({
            message: "Duplicate key error",
            success: false,
            error: {
                name: "MongoError",
                errors: err.keyValue,
            },
        });
        return;
    }
    // Custom ApiError
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json({
            message: err.message,
            success: false,
            error: (_a = err.error) !== null && _a !== void 0 ? _a : null,
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
exports.errorHandler = errorHandler;
