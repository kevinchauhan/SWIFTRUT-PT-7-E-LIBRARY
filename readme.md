# E-Library App

This is a full-stack E-Library Application that allows users to view, borrow, and return books. Users can also manage the library by adding, editing, or deleting books. The app features user authentication for managing books and borrowing/returning functionality.

## Features

- **View Books**: Browse a list of available books with details like title, author, genre, description, and available copies.
- **Borrow Books**: Authenticated users can borrow books, reducing the available copies.
- **Return Books**: Authenticated users can return borrowed books, increasing the available copies.
- **Add Book**: Authenticated users can add new books to the library, including details like title, author, genre, description, and cover image.
- **Edit Book**: Authenticated users can update the details of existing books.
- **Delete Book**: Authenticated users can remove books from the library.
- **User Authentication**: Login and signup functionality for user accounts.
- **Notifications**: Toast notifications for actions like borrowing, returning, and managing books.

## Tech Stack

- **Frontend**:

  - React.js
  - TailwindCSS
  - Zustand (State Management)
  - Axios (HTTP Requests)
  - React Toastify (Notifications)

- **Backend**:

  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JSON Web Tokens (JWT) for authentication

- **Deployment**:
  - Frontend: [https://swiftrut-pt-7-e-library.vercel.app](https://swiftrut-pt-7-e-library.vercel.app)
  - Backend: [https://swiftrut-pt-7-e-library.onrender.com](https://swiftrut-pt-7-e-library.onrender.com)
