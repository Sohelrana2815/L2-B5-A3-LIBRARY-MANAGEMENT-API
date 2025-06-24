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
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const books_model_1 = require("../models/books.model");
const ApiError_1 = require("../../utils/ApiError");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRoutes = express_1.default.Router();
const borrowZodSchema = zod_1.z.object({
    book: zod_1.z.string().min(1, "Book ID is mandatory"),
    quantity: zod_1.z.number().int().positive("Quantity must be positive integer"),
    dueDate: zod_1.z
        .string()
        .datetime({ offset: true })
        .refine((value) => new Date(value) > new Date(), "Due date must be in the future"),
});
// Borrow a book
exports.borrowRoutes.post("/borrow", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const borrowPayload = yield borrowZodSchema.parseAsync(req.body);
        // Find the book
        const book = yield books_model_1.Book.findById(borrowPayload.book);
        if (!book) {
            throw new ApiError_1.ApiError(404, "Book not found");
        }
        // Check available copies
        if (book.copies < borrowPayload.quantity) {
            throw new ApiError_1.ApiError(400, `Only ${book.copies} copies available, requested ${borrowPayload.quantity}`);
        }
        // Deduct copies - the pre-save hook will handle availability
        book.copies -= borrowPayload.quantity;
        yield book.save();
        // Create borrow record
        const borrow = new borrow_model_1.Borrow({
            book: borrowPayload.book,
            quantity: borrowPayload.quantity,
            dueDate: new Date(borrowPayload.dueDate),
        });
        const created = yield borrow.save();
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: created,
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.borrowRoutes.get("/borrow", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summery = yield borrow_model_1.Borrow.aggregate([
            // Stage-1: Group by ID and calculate total borrowed quantity
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            // Stage-2 Join the borrows collection with books collection
            {
                $lookup: {
                    from: "books", // Collection name
                    localField: "_id", // Field form borrows collection (Book ObjectId)
                    foreignField: "_id", // Field from books collection _id
                    as: "bookDetails",
                },
            },
            // Stage-3 unwind the bookDetails array (converts to object)
            {
                $unwind: "$bookDetails",
            },
            // Stage-4 Project only required fields
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summery,
        });
    }
    catch (err) {
        next(err);
    }
}));
