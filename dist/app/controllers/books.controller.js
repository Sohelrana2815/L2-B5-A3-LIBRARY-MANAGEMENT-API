"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const zod_1 = require("zod");
const ApiError_1 = require("../../utils/ApiError");
exports.booksRoutes = express_1.default.Router();
const bookZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(10),
    author: zod_1.z.string().min(5),
    genre: zod_1.z.enum([
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
    ]),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().int().nonnegative().min(1),
    available: zod_1.z.boolean(),
});
// CREATE A BOOK
exports.booksRoutes.post("/books", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Zod validation error if req.body is invalid data
        const bookPayload = yield bookZodSchema.parseAsync(req.body);
        console.log(bookPayload, "post");
        const created = yield books_model_1.Book.create(bookPayload);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: created,
        });
    }
    catch (err) {
        next(err);
    }
}));
// GET ALL BOOKS
exports.booksRoutes.get("/books", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield books_model_1.Book.find({});
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (err) {
        next(err);
    }
}));
// GET SINGLE BOOK (BY ID)
exports.booksRoutes.get("/books/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield books_model_1.Book.findById(req.params.bookId);
        if (!book) {
            // throw 404 error from ApiError
            throw new ApiError_1.ApiError(404, "Book not found");
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (err) {
        next(err);
    }
}));
// UPDATE A SINGLE BOOK
exports.booksRoutes.put("/books/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        // Zod validation
        const bookPayload = yield bookZodSchema.partial().parseAsync(req.body);
        const updated = yield books_model_1.Book.findByIdAndUpdate(bookId, bookPayload, {
            new: true,
            runValidators: true,
        });
        if (!updated)
            throw new ApiError_1.ApiError(404, "Book not found");
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updated,
        });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE A BOOK
exports.booksRoutes.delete("/books/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        const deleted = yield books_model_1.Book.findByIdAndDelete(bookId);
        if (!deleted)
            throw new ApiError_1.ApiError(404, "Book not found");
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (err) {
        next(err);
    }
}));
