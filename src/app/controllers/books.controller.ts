import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/books.model";
import { z } from "zod";
import { ApiError } from "../../utils/ApiError";

export const booksRoutes = express.Router();

const bookZodSchema = z.object({
  title: z.string().min(10),
  author: z.string().min(5),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),

  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().int().nonnegative(),
  available: z.boolean(),
});

// CREATE A BOOK
booksRoutes.post(
  "/books",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Zod validation error if req.body is invalid data
      const bookPayload = await bookZodSchema.parseAsync(req.body);
      console.log(bookPayload, "post");
      const created = await Book.create(bookPayload);

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: created,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET ALL BOOKS

booksRoutes.get(
  "/books",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await Book.find({});
      res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: books,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET SINGLE BOOK (BY ID)

booksRoutes.get(
  "/books/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findById(req.params.bookId);
      if (!book) {
        // throw 404 error from ApiError
        throw new ApiError(404, "Book not found");
      }
      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (err) {
      next(err);
    }
  }
);

// UPDATE A SINGLE BOOK
booksRoutes.put(
  "/books/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    try {
      // Zod validation
      const bookPayload = await bookZodSchema.partial().parseAsync(req.body);

      const updated = await Book.findByIdAndUpdate(bookId, bookPayload, {
        new: true,
        runValidators: true,
      });

      if (!updated) throw new ApiError(404, "Book not found");
      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE A BOOK

booksRoutes.delete(
  "/books/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
      const deleted = await Book.findByIdAndDelete(bookId);

      if (!deleted) throw new ApiError(404, "Book not found");
      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
);
