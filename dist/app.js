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
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        required: true,
        enum: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
    },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: "" },
    copies: {
        type: Number,
        require: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
const Book = (0, mongoose_1.model)("Book", bookSchema);
// CREATE A BOOK
app.post("/api/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookPayload = req.body;
    console.log(bookPayload);
    const book = yield Book.create(bookPayload);
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
    });
}));
// GET ALL BOOKS
app.get("/api/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield Book.find({});
    res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: books,
    });
}));
// GET SINGLE BOOK (BY ID)
app.get("/api/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield Book.findById(bookId);
    res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
    });
}));
// UPDATE A SINGLE BOOK
app.put("/api/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const bookToUpdate = req.body;
    const updatedBook = yield Book.findByIdAndUpdate(bookId, bookToUpdate, {
        new: true,
    });
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
    });
}));
app.delete("/api/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    yield Book.findByIdAndDelete(bookId);
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
    });
}));
app.get("/", (req, res) => {
    res.send("Welcome to library management app📚.");
});
exports.default = app;
