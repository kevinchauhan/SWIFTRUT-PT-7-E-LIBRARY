import express from 'express';
import { BookController } from '../controllers/BookController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();
const bookController = new BookController();

router.post('/', authenticate, bookController.createBook);
router.get('/', bookController.getBooks);
router.get("/borrowed-books", authenticate, bookController.getBorrowedBooks);
router.get('/:bookId', bookController.getBookById);
router.put('/:bookId', authenticate, bookController.editBook);
router.delete('/:bookId', authenticate, bookController.deleteBook);
router.post('/:bookId/borrow', authenticate, bookController.borrowBook);
router.post('/:bookId/return', authenticate, bookController.returnBook);
router.get('/user', authenticate, bookController.getUserCreatedBooks);

export default router;
