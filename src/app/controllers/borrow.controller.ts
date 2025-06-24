import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Book } from "../models/books.model";
import { ApiError } from "../../utils/ApiError";
import { IBooks } from "../interfaces/books.interface";
import { Borrow } from "../models/borrow.model";

export const borrowRoutes = express.Router();

const borrowZodSchema = z.object({
  book: z.string().min(1, "Book ID is mandatory"),
  quantity: z.number().int().positive("Quantity must be positive integer"),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .refine(
      (value) => new Date(value) > new Date(),
      "Due date must be in the future"
    ),
});

// Borrow a book

borrowRoutes.post(
  "/borrow",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const borrowPayload = await borrowZodSchema.parseAsync(req.body);

      // Find the book
      const book = await Book.findById(borrowPayload.book);

      if (!book) {
        throw new ApiError(404, "Book not found");
      }

      // Check available copies

      if (book.copies < borrowPayload.quantity) {
        throw new ApiError(
          400,
          `Only ${book.copies} copies available, requested ${borrowPayload.quantity}`
        );
      }

      // Deduct copies - the pre-save hook will handle availability

      book.copies -= borrowPayload.quantity;
      await book.save();

      // Create borrow record

      const borrow = new Borrow({
        book: borrowPayload.book,
        quantity: borrowPayload.quantity,
        dueDate: new Date(borrowPayload.dueDate),
      });

      const created = await borrow.save();

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: created,
      });
    } catch (err) {
      next(err);
    }
  }
);
