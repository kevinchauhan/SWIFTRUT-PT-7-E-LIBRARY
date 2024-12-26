import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [availableCopies, setAvailableCopies] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [titleError, setTitleError] = useState('');
    const [authorError, setAuthorError] = useState('');
    const [genreError, setGenreError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [availableCopiesError, setAvailableCopiesError] = useState('');
    const [imageError, setImageError] = useState('');

    // Validation for book data
    const validateForm = () => {
        let isValid = true;

        // Reset errors
        setTitleError('');
        setAuthorError('');
        setGenreError('');
        setDescriptionError('');
        setAvailableCopiesError('');
        setImageError('');

        // Validate title
        if (!title) {
            setTitleError('Title is required');
            isValid = false;
        }

        // Validate author
        if (!author) {
            setAuthorError('Author is required');
            isValid = false;
        }

        // Validate genre
        if (!genre) {
            setGenreError('Genre is required');
            isValid = false;
        }

        // Validate description
        if (!description) {
            setDescriptionError('Description is required');
            isValid = false;
        }

        // Validate availableCopies
        if (!availableCopies || isNaN(availableCopies) || availableCopies <= 0) {
            setAvailableCopiesError('Valid Available Copies is required');
            isValid = false;
        }

        // Validate image
        if (!image) {
            setImageError('Image is required');
            isValid = false;
        }

        return isValid;
    };

    // Handle image upload to Cloudinary
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append("upload_preset", "ml_default");
            formData.append("cloud_name", "dqs5lnafn");

            try {
                const response = await axios.post('https://api.cloudinary.com/v1_1/dqs5lnafn/image/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: false, // Ensure credentials are not included
                });
                setImage(response.data.secure_url);
                setImagePreview(URL.createObjectURL(file)); // Preview image after upload
            } catch (error) {
                toast.error('Image upload failed');
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please fill in all fields correctly.');
            return;
        }

        try {
            const bookData = {
                title,
                author,
                genre,
                description,
                image,
                availableCopies,
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/books`, bookData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                toast.success('Book added successfully');
                // Reset the form
                setTitle('');
                setAuthor('');
                setGenre('');
                setDescription('');
                setAvailableCopies('');
                setImage(null);
                setImagePreview(null);
            }
        } catch (error) {
            toast.error('Failed to add book. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add a New Book</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80c0a0]"
                            />
                            {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
                        </div>

                        {/* Author */}
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                                id="author"
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80c0a0]"
                            />
                            {authorError && <p className="text-red-500 text-sm mt-1">{authorError}</p>}
                        </div>

                        {/* Genre */}
                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                            <input
                                id="genre"
                                type="text"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80c0a0]"
                            />
                            {genreError && <p className="text-red-500 text-sm mt-1">{genreError}</p>}
                        </div>

                        {/* Available Copies */}
                        <div>
                            <label htmlFor="availableCopies" className="block text-sm font-medium text-gray-700">Available Copies</label>
                            <input
                                id="availableCopies"
                                type="number"
                                value={availableCopies}
                                onChange={(e) => setAvailableCopies(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80c0a0]"
                            />
                            {availableCopiesError && <p className="text-red-500 text-sm mt-1">{availableCopiesError}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80c0a0]"
                        />
                        {descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Book Cover Image</label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80c0a0]"
                        />
                        {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 w-40 h-auto rounded-md" />}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#2c493e] text-white text-lg font-semibold rounded-md hover:bg-[#1e3d34] transition duration-200"
                    >
                        Add Book
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
