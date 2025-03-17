const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());
let books = [];

app.get('/whoami', (req, res) => {
    res.json({ studentNumber: "2550411" });
});

app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
});

app.post('/books', (req, res) => {
    const { id, title, details } = req.body;
    
    if (!id || !title || !Array.isArray(details)) {
        return res.status(400).json({ error: "Missing required book details" });
    }
    
    const newBook = { id, title, details };
    books.push(newBook);
    
    res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
    const { title, details } = req.body;
    const book = books.find(b => b.id === req.params.id);

    if (!book) return res.status(404).json({ error: "Book not found" });

    if (title) book.title = title;
    if (details) book.details = details;

    res.json(book);
});

app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === req.params.id);
    if (bookIndex === -1) return res.status(404).json({ error: "Book not found" });

    books.splice(bookIndex, 1);
    res.status(204).send();
});

app.post('/books/:id/details', (req, res) => {
    const { id, author, genre, publicationYear } = req.body;
    const book = books.find(b => b.id === req.params.id);

    if (!book) return res.status(404).json({ error: "Book not found" });

    if (!id || !author || !genre || !publicationYear) {
        return res.status(400).json({ error: "Missing required detail fields" });
    }

    book.details.push({ id, author, genre, publicationYear });
    res.status(201).json(book);
});

app.delete('/books/:id/details/:detailId', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const detailIndex = book.details.findIndex(d => d.id === req.params.detailId);
    if (detailIndex === -1) return res.status(404).json({ error: "Detail not found" });

    book.details.splice(detailIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});