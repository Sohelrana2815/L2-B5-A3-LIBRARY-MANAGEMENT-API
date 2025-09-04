import { model, Schema } from "mongoose";
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
      min: [0, "Copies must be a non-negative number."],
      validate: {
        validator: Number.isInteger,
        message: "Copies must be an integer",
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// pre-save hook

bookSchema.pre<IBooks>("save", function (next) {
  // Automatically set available based on copies count
  this.available = this.copies > 0; // 0 > 0 = false
  next();
});

export const Book = model<IBooks>("Book", bookSchema);
