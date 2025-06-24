import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book ID is mandatory"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is mandatory"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an positive integer",
      },
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is mandatory"],
      validate: {
        validator: (value: Date) => value > new Date(), // Borrow date must be less then returned date
        message: "Due date must be in the future",
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Borrow = model("Borrow", borrowSchema);
