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
exports.booksRoutes = express_1.default.Router();
// CREATE A BOOK
exports.booksRoutes.post("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookPayload = req.body;
    console.log(bookPayload);
    const book = yield books_model_1.Book.create(bookPayload);
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
    });
}));
// GET ALL BOOKS
exports.booksRoutes.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield books_model_1.Book.find({});
    res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: books,
    });
}));
// GET SINGLE BOOK (BY ID)
exports.booksRoutes.get("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield books_model_1.Book.findById(bookId);
    res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
    });
}));
// UPDATE A SINGLE BOOK
exports.booksRoutes.put("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const bookToUpdate = req.body;
    const updatedBook = yield books_model_1.Book.findByIdAndUpdate(bookId, bookToUpdate, {
        new: true,
    });
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
    });
}));
exports.booksRoutes.delete("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    yield books_model_1.Book.findByIdAndDelete(bookId);
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
    });
}));
