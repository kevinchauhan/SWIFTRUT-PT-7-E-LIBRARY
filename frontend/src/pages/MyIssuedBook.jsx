import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MyIssuedBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/books/user`,
                    { withCredentials: true } // Include cookies for authentication
                );
                setBooks(response.data?.books || []);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch issued books.');
            }
        };

        fetchBorrowedBooks();
    }, []);

    const handleDeleteBook = async (bookId) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/books/${bookId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success('Book deleted successfully!');
                setBooks(books.filter((book) => book._id !== bookId));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete book. Please try again.');
        }
    };

    const handleEditBook = (bookId) => {
        // Redirect to the edit page
        window.location.href = `/edit-book/${bookId}`;
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                    My Issued Books
                </h1>

                {books.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">
                        You have not added any book yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div
                                key={book._id}
                                className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col"
                            >
                                <img
                                    src={book.image || '/placeholder.jpg'}
                                    alt={book.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4 flex-grow">
                                    <h3 className="text-sm font-semibold text-gray-800">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {book.description}
                                    </p>
                                    <div className="mt-3 text-xs text-gray-600">
                                        <span className="block">Author: <span className="font-medium">{book.author}</span></span>
                                        <span className="block">Genre: <span className="font-medium">{book.genre}</span></span>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-100 flex justify-between items-center mt-auto">
                                    <button
                                        onClick={() => handleEditBook(book._id)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded-lg text-xs hover:bg-blue-600 transition flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBook(book._id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded-lg text-xs hover:bg-red-600 transition flex items-center"
                                    >
                                        <FaTrash className="mr-1" /> Delete
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

export default MyIssuedBooks;
