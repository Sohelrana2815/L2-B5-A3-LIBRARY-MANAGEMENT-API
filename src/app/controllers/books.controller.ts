import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { z } from "zod";

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
booksRoutes.post("/books", async (req: Request, res: Response) => {
  const bookPayload = await bookZodSchema.parseAsync(req.body);
  console.log(bookPayload, "zod body");

  // const book = await Book.create(bookPayload);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: {},
  });
});

// GET ALL BOOKS

booksRoutes.get("/books", async (req: Request, res: Response) => {
  const books = await Book.find({});
  res.status(200).json({
    success: true,
    message: "Books retrieved successfully",
    data: books,
  });
});

// GET SINGLE BOOK (BY ID)

booksRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  const book = await Book.findById(bookId);

  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

// UPDATE A SINGLE BOOK
booksRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const bookToUpdate = req.body;
  const updatedBook = await Book.findByIdAndUpdate(bookId, bookToUpdate, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: updatedBook,
  });
});

// DELETE A BOOK

booksRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  await Book.findByIdAndDelete(bookId);
  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});
