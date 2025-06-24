import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Book } from "../models/books.model";
import { ApiError } from "../../utils/ApiError";

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

      const book = await Book.findById(borrowPayload.book); // book has Book model _id

      if (!book) {
        throw new ApiError(404, "Book not found");
      }

   


    } catch (err) {}
  }
);
