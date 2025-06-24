import { Document, model, Schema } from "mongoose";
import { IBooks } from "../interfaces/books.interface";

const bookSchema = new Schema<IBooks>(
  {
    title: {
      type: String,
      required: [true, "Book title is mandatory."],
      trim: true,
      minlength: [10, "Title must be at least 10 characters."],
      maxlength: [50, "Title cannot exceed 50 characters."],
    },
    author: {
      type: String,
      required: [true, "Book author is mandatory."],
      trim: true,
      minlength: [5, "Author name must be at least 5 characters."],
      maxlength: [20, "Author name cannot exceed 20 characters."],
    },
    genre: {
      type: String,
      required: [true, "Book genre is mandatory."],
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message:
          "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY.",
      },
    },
    isbn: {
      type: String,
      required: [true, "ISBN is mandatory."],
      unique: true,
      trim: true,
    },

    description: { type: String, trim: true },

    copies: {
      type: Number,
      required: [true, "Number of copies is mandatory."],
      min: [1, "Copies must be a non-negative number."],
      validate: {
        validator: Number.isInteger,
        message: "Copies must be an integer",
      },
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

bookSchema.methods.borrowCopies = async function (
  this: Document & { copies: number; available: boolean },
  qty: number
) {
  if (this.copies < qty) {
    throw new Error("Not enough copies available");
  }

  this.copies -= qty;

  if (this.copies === 0) {
    this.available = false;
  }
  await this.save();
};

export const Book = model<
  IBooks & Document & { borrowCopies(qty: number): Promise<void> }
>("Book", bookSchema);
