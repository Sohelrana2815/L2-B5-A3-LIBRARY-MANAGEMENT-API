import express, { Application } from "express";
import { booksRoutes } from "./app/controllers/books.controller";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { errorHandler } from "./middleware/errorHandler";
import { borrowRoutes } from "./app/controllers/borrow.controller";

const app: Application = express();

app.use(express.json());

app.use("/api", booksRoutes);
app.use("/api", borrowRoutes);

app.get("/", (_, res) => {
  res.send("Welcome to library management app📚.");
});

// 404 for unmatched routes

app.use(notFoundHandler);

// global error handler

app.use(errorHandler);

export default app;
