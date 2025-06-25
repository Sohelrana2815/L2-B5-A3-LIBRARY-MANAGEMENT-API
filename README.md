# 📚 Library Management API

This project is a RESTful API for a Library Management System, built with **Express.js**, **TypeScript**, and **MongoDB** (via Mongoose). It allows for managing books, tracking borrowed items, and providing summaries of borrowed books.

---

## ✨ Features

* **Book Management (CRUD):** 📖

  * Create new book entries.
  * Retrieve all books with robust filtering by genre, sorting by any field (createdAt, title, author, etc.) in ascending or descending order, and limiting results.
  * Retrieve a single book by its ID.
  * Update existing book details (e.g., number of copies).
  * Delete books from the system.
* **Book Borrowing:** 📤

  * Record borrowed books with quantity and due dates.
  * Business Logic Enforcement: Automatically checks for available copies before borrowing and updates book availability status if all copies are borrowed (implemented using a Mongoose instance method).
* **Borrowed Books Summary:** 📊

  * Provides an aggregated summary of borrowed books, showing total quantity borrowed per book, along with its title and ISBN. This uses MongoDB's aggregation pipeline.
* **Robust Schema Validation:** ✅ Implemented using Zod for incoming request payloads and Mongoose's built-in schema validation for data integrity.
* **Mongoose Middleware:** 🔗 Utilizes Mongoose pre and post middleware hooks for automated createdAt and updatedAt timestamps and for updating book availability.
* **Centralized Error Handling:** 🚫 Custom error handling for Zod validation errors, Mongoose specific errors (CastError, ValidationError, Duplicate Key Error), and custom API errors, ensuring consistent error responses.

---

## 🚀 Technologies Used

* **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
* **TypeScript:** Strongly typed superset of JavaScript that compiles to plain JavaScript.
* **Mongoose:** MongoDB object data modeling (ODM) for Node.js, providing a straightforward, schema-based solution to model your application data.
* **Zod:** TypeScript-first schema declaration and validation library, used for validating incoming API request bodies.
* **dotenv:** Loads environment variables from a `.env` file.

---

## ⚙️ Local Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* A MongoDB Atlas cluster or a local MongoDB instance.

### Installation Steps

1. **Clone the repository:** ⬇️

   ```bash
   git clone https://github.com/SohelRana/library-management-api.git # Replace with your repo URL
   cd library-management-api
   ```

2. **Install dependencies:** 📦

   ```bash
   npm install
   ```

3. **Create a `.env` file:** 🔑

   The project uses environment variables for sensitive information like database credentials. Create a file named `.env` in the root directory of the project.
   **Note:** This `.env` file is excluded from version control for security reasons (via `.gitignore`), so you need to create it manually.

   Add the following content to your `.env` file:

   ```dotenv
   DB_USERNAME=library_admin
   DB_PASSWORD=XBhvHeAj0sU5yfj0
   PORT=5000 # Optional, defaults to 5000 if not set
   ```

   Replace `library_admin` and `XBhvHeAj0sU5yfj0` with your actual MongoDB Atlas database username and password if different.

4. **Run the development server:** ▶️

   ```bash
   npm run dev
   ```

   The API server should now be running on `http://localhost:5000` (or the `PORT` you specified in `.env`). You will see console messages confirming MongoDB connection and server start.

---

## 🗺️ API Endpoints

All API endpoints are prefixed with `/api`.

### 1. Create Book ➕

**Endpoint:** `POST /api/books`
**Description:** Creates a new book entry in the database.

**Request Body Example:**

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

**Success Response Example:**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

### 2. Get All Books 📚

**Endpoint:** `GET /api/books`
**Description:** Retrieves a list of all books. Supports filtering, sorting, and pagination.

**Query Parameters:**

* `filter`: (Optional) Filter books by genre (e.g., `FICTION`, `SCIENCE`), case-insensitive.
* `sortBy`: (Optional) Field to sort by (e.g., `createdAt`, `title`, `author`).
* `sort`: (Optional) Sort order. `asc` for ascending, `desc` for descending. Default is `desc`.
* `limit`: (Optional) Number of results per page. Default is `10`.

**Example Query:** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

**Success Response Example:**

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
    // ... more book objects
  ]
}
```

### 3. Get Book by ID 🔍

**Endpoint:** `GET /api/books/:bookId`
**Description:** Retrieves a single book by its unique ID.

**Success Response Example:**

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

### 4. Update Book ✍️

**Endpoint:** `PUT /api/books/:bookId`
**Description:** Updates an existing book's details.

**Request Body Example:**

```json
{
  "copies": 50
}
```

**Success Response Example:**

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 50,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-20T08:30:00.000Z"
  }
}
```

### 5. Delete Book 🗑️

**Endpoint:** `DELETE /api/books/:bookId`
**Description:** Deletes a book from the database.

**Success Response Example:**

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

### 6. Borrow a Book 🤝

**Endpoint:** `POST /api/borrow`
**Description:** Records a book borrowing transaction. Includes business logic to verify availability and update book copies.

**Request Body Example:**

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Success Response Example:**

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

### 7. Borrowed Books Summary (Using Aggregation) 📈

**Endpoint:** `GET /api/borrow`
**Description:** Returns a summary of borrowed books, showing the total borrowed quantity per book along with its title and ISBN.

**Success Response Example:**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## ⚠️ Generic Error Response

All error responses adhere to the following structure for consistency:

```json
{
  "message": "A brief error message explaining what went wrong.",
  "success": false,
  "error": {
    "name": "ErrorType", // e.g., "ValidationError", "ZodError", "MongoError"
    "errors": {
      // Details of the specific error, could be an object or array
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

---

## 📄 License

This project is licensed under the MIT License.

---

**MIT License**

Copyright (c) 2025 Sohel Rana
