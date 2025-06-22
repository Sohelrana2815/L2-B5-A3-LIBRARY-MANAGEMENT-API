import express, { Request, Response } from "express";
import { Book } from "../models/books.model";

export const booksRoutes = express.Router();

// CREATE A BOOK
booksRoutes.post("/books", async (req: Request, res: Response) => {
  const bookPayload = req.body;
  console.log(bookPayload);

  const book = await Book.create(bookPayload);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: book,
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

booksRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  await Book.findByIdAndDelete(bookId);
  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});
