# API Documentation

This document provides an overview of the available HTTP endpoints for managing todos and categories.

---

## Todo Endpoints

### 1. **GET /api/todos**
Retrieve all todo items.

### 2. **POST /api/todos**
Create a new todo item.

### 3. **PUT /api/todos?id={id}**
Update a todo item by ID.

### 4. **DELETE /api/todos?id={id}**
Delete a specific todo item by ID.

### 5. **DELETE /api/todos?action=clear_completed**
Clear all completed todos.

---

## Category Endpoints

### 1. **GET /api/categories**
Retrieve all categories.

### 2. **POST /api/categories**
Create a new category.

### 3. **PUT /api/categories?id={id}**
Update a category by ID.

### 4. **DELETE /api/categories?category={category}**
Delete a specific category by name.

---

## Error Handling

The API returns standard HTTP error responses for common issues:

- **400 Bad Request**: Missing required parameters or malformed request.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Unexpected server error.
- **422 Unprocessable Entity**: Invalid data format.
- **403 Forbidden**: Insufficient permissions to access the resource.
- **401 Unauthorized**: Authentication required.