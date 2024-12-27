import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyBorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    // Fetch borrowed books
    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/books/borrowed-books`, {
                    withCredentials: true, // Ensure user is authenticated
                });
                setBorrowedBooks(response.data.books);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch borrowed books.');
            }
        };

        fetchBorrowedBooks();
    }, []);

    // Handle returning a book
    const handleReturnBook = async (bookId, index) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/books/${bookId}/return`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success('Book returned successfully!');
                const updatedBooks = [...borrowedBooks];
                updatedBooks.splice(index, 1); // Remove returned book from the list
                setBorrowedBooks(updatedBooks);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to return book.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                    My Borrowed Books
                </h1>
                {borrowedBooks.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                        You have not borrowed any books yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {borrowedBooks.map((book, index) => (
                            <div
                                key={book._id}
                                className="bg-white border rounded-lg shadow-md overflow-hidden"
                            >
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {book.description}
                                    </p>
                                    <div className="mt-3 text-xs text-gray-600">
                                        <span className="block">Author: <span className="font-medium">{book.author}</span></span>
                                        <span className="block">Genre: <span className="font-medium">{book.genre}</span></span>
                                        <span className="block">Borrowed On: <span className="font-medium">{new Date(book.borrowedDate).toLocaleDateString()}</span></span>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-100 flex justify-between items-center">
                                    <button
                                        onClick={() => handleReturnBook(book._id, index)}
                                        className="bg-red-600 text-white py-1 px-3 rounded-lg text-xs hover:bg-red-700 transition"
                                    >
                                        Return
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBorrowedBooks;
