import Book from '../models/Book.js';

export class BookController {
    async createBook(req, res) {
        try {
            const { title, author, genre, description, image, availableCopies } = req.body;

            if (!title || !author || !genre || !description || !image || !availableCopies) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const newBook = new Book({
                title,
                author,
                genre,
                description,
                image,
                availableCopies,
            });

            await newBook.save();
            res.status(201).json({ success: true, book: newBook });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getBooks(req, res) {
        try {
            const { title, genre, limit = 10, page = 1, sortBy = 'title', order = 'asc' } = req.query;
            const filter = {};
            if (title) filter.title = { $regex: new RegExp(title, 'i') };
            if (genre) filter.genre = genre;

            const books = await Book.find(filter)
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await Book.countDocuments(filter);

            res.status(200).json({
                success: true,
                books,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async borrowBook(req, res) {
        try {
            const { bookId } = req.params;

            const book = await Book.findById(bookId);
            if (!book || book.availableCopies <= 0) {
                return res.status(404).json({ success: false, message: "Book not available for borrowing" });
            }

            const alreadyBorrowed = book.borrowedBy.includes(req.user.id);
            if (alreadyBorrowed) {
                return res.status(400).json({ success: false, message: "You have already borrowed this book" });
            }

            book.availableCopies -= 1;
            book.borrowedBy.push(req.user.id);
            await book.save();

            res.status(200).json({ success: true, message: "Book borrowed successfully", book });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async returnBook(req, res) {
        try {
            const { bookId } = req.params;

            const book = await Book.findById(bookId);
            if (!book || !book.borrowedBy.includes(req.user.id)) {
                return res.status(404).json({ success: false, message: "You have not borrowed this book" });
            }

            book.availableCopies += 1;
            book.borrowedBy = book.borrowedBy.filter(userId => userId.toString() !== req.user.id);
            await book.save();

            res.status(200).json({ success: true, message: "Book returned successfully", book });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async editBook(req, res) {
        try {
            const { bookId } = req.params;
            const { title, author, genre, description, image, availableCopies } = req.body;

            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ success: false, message: "Book not found" });
            }

            book.title = title || book.title;
            book.author = author || book.author;
            book.genre = genre || book.genre;
            book.description = description || book.description;
            book.image = image || book.image;
            book.availableCopies = availableCopies || book.availableCopies;

            await book.save();
            res.status(200).json({ success: true, book });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async deleteBook(req, res) {
        try {
            const { bookId } = req.params;

            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ success: false, message: "Book not found" });
            }

            await book.deleteOne();
            res.status(200).json({ success: true, message: "Book deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getBookById(req, res) {
        try {
            const { bookId } = req.params;

            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ success: false, message: "Book not found" });
            }

            res.status(200).json({ success: true, book });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
