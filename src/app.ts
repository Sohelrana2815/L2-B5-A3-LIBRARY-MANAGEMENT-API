import express, { Application, Request, Response } from "express";
import { model, Schema } from "mongoose";

const app: Application = express();

app.use(express.json());

const bookSchema = new Schema(
  {
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = model("Book", bookSchema);
// CREATE A BOOK
app.post("/api/books", async (req: Request, res: Response) => {
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

app.get("/api/books", async (req: Request, res: Response) => {
  const books = await Book.find({});
  res.status(200).json({
    success: true,
    message: "Books retrieved successfully",
    data: books,
  });
});

// GET SINGLE BOOK (BY ID)

app.get("/api/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  const book = await Book.findById(bookId);

  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

app.put("/api/books/:bookId", async (req: Request, res: Response) => {
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

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library management app📚.");
});

export default app;
