import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const Home = () => {
    const { isAuthenticated } = useAuthStore();
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState({
        query: '', // Single search query
        fromDate: '',
        toDate: ''
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/books`, {
                    params: filters
                });
                setBooks(response.data?.books);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const resetFilters = () => {
        setFilters({
            query: '', // Reset the search query
            fromDate: '',
            toDate: ''
        });
    };

    const handleBorrowBook = async (bookId, index) => {
        if (!isAuthenticated) {
            toast.error('You must be logged in to borrow a book.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/books/${bookId}/borrow`, {}, { withCredentials: true });

            if (response.status === 200) {
                toast.success('Book borrowed successfully!');
                const updatedBooks = [...books];
                updatedBooks[index].availableCopies -= 1;
                setBooks(updatedBooks);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to borrow book. Please try again.');
        }
    };

    const handleReturnBook = async (bookId, index) => {
        if (!isAuthenticated) {
            toast.error('You must be logged in to return a book.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/books/${bookId}/return`, {}, { withCredentials: true });

            if (response.status === 200) {
                toast.success('Book returned successfully!');
                const updatedBooks = [...books];
                updatedBooks[index].availableCopies += 1;
                setBooks(updatedBooks);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to return book. Please try again.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                    Browse Books
                </h1>

                {/* Filters Section */}
                <div className="flex flex-wrap items-center justify-start gap-4 mb-8 bg-white p-4 rounded-lg shadow-md border">
                    <div className="flex flex-col w-1/3">
                        <label htmlFor="query" className="text-xs text-gray-500 mb-1">Search</label>
                        <input
                            type="text"
                            id="query"
                            name="query"
                            value={filters.query}
                            onChange={handleFilterChange}
                            placeholder="Search by title, genre, or author"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#2c493e] focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="fromDate" className="text-xs text-gray-500 mb-1">From Publication Year</label>
                        <input
                            type="date"
                            id="fromDate"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#2c493e] focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="toDate" className="text-xs text-gray-500 mb-1">To Publication Year</label>
                        <input
                            type="date"
                            id="toDate"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#2c493e] focus:outline-none"
                        />
                    </div>

                    <div className='pt-4'>
                        <button
                            onClick={resetFilters}
                            className="flex items-center justify-center bg-[#2c493e] text-white px-3 py-2 rounded-lg text-xs hover:bg-[#2c493e] transition focus:outline-none"
                        >
                            <FaTimes className="mr-1" /> Reset Filters
                        </button>
                    </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.length === 0 ? (
                        <p className="text-gray-500 text-sm col-span-full text-center">
                            No books available at the moment.
                        </p>
                    ) : (
                        books.map((book, index) => (
                            <div
                                key={book._id}
                                className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col"
                            >
                                <img
                                    src={book.image}
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
                                        <span className="block">Available: <span className="font-medium">{book.availableCopies}</span></span>
                                        <span className="block">Published: <span className="font-medium">{new Date(book.publicationDate).toLocaleDateString()}</span></span>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-100 flex justify-between items-center mt-auto">
                                    {book.availableCopies > 0 ? (
                                        <button
                                            onClick={() => handleBorrowBook(book._id, index)}
                                            className="bg-[#2c493e] text-white py-1 px-3 rounded-lg text-xs hover:bg-[#2c493e] transition"
                                        >
                                            Borrow
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleReturnBook(book._id, index)}
                                            className="bg-green-600 text-white py-1 px-3 rounded-lg text-xs hover:bg-green-700 transition"
                                        >
                                            Return
                                        </button>
                                    )}
                                    <Link
                                        to={`/book/${book._id}`}
                                        className="text-[#2c493e] hover:underline text-xs"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
