"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./app/controllers/books.controller");
const notFoundHandler_1 = require("./middleware/notFoundHandler");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", books_controller_1.booksRoutes);
app.get("/", (_, res) => {
    res.send("Welcome to library management app📚.");
});
// 404 for unmatched routes
app.use(notFoundHandler_1.notFoundHandler);
// global error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
