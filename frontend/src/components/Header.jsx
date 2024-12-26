import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AiFillCaretDown } from 'react-icons/ai';

const Header = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/logout`);
            logout(); // Clear the user state in Zustand
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className="bg-white shadow-md py-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo placeholder */}
                <div className="flex items-center space-x-2">
                    <h1 className="text-lg font-semibold text-gray-800">
                        <Link to="/" className="hover:text-indigo-600">E-Library</Link>
                    </h1>
                </div>
                <nav>
                    <ul className="flex space-x-6 text-lg font-medium items-center">
                        <li>
                            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition duration-200 focus:outline-none">Home</Link>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition duration-200 focus:outline-none">Login</Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="text-gray-700 hover:text-indigo-600 transition duration-200 focus:outline-none">Signup</Link>
                                </li>
                            </>
                        ) : (
                            <li className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition duration-200 focus:outline-none"
                                >
                                    <FaUserCircle size={24} />
                                    <AiFillCaretDown />
                                </button>

                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
