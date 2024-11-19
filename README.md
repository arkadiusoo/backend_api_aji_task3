# Backend for Shop Application - API

## Project Overview

The project aims to create a server-side application for an online shop, providing an API for managing products, orders, categories, and order statuses. Data is stored in a relational or non-relational database, and the application includes validation, error handling, and business logic.

## Core Requirements

1. **Data Management**:
   - **Products**: Create, update, fetch list and details.
   - **Categories**: Fetch list.
   - **Orders**: Create, update status, filter by user or status.
   - **Order Statuses**: Predefined list of statuses.

2. **Validation and Error Handling**:
   - Validate data (e.g., price, weight, order statuses).
   - Handle errors using HTTP codes and detailed JSON responses.

## Additional Features

1. **SEO**: Endpoint to generate SEO-optimized HTML descriptions for products.
2. **Authentication**: JWT-based authentication, securing endpoints.
3. **Data Initialization**: Import products from JSON/CSV files.
4. **Reviews**: Add ratings and comments for orders.
