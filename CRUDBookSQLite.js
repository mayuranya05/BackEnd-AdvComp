require("dotenv").config();
const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

// Initialize database
const db = new sqlite3.Database('./Database/Book.sqlite');

// Middleware to parse JSON
app.use(express.json());

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL
)`);

// Get all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Get a book by id
app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (!row) {
                res.status(404).send('Book not found');
            } else {
                res.json(row);
            }
        }
    });
});

// Add a new book
app.post('/books', (req, res) => {
    const book = req.body;
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', book.title, book.author, function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            book.id = this.lastID;
            res.status(201).json(book);
        }
    });
});

// Update a book by id
app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', book.title, book.author, req.params.id, function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (this.changes === 0) {
                res.status(404).send('Book not found');
            } else {
                res.json(book);
            }
        }
    });
});

// Delete a book by id
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (this.changes === 0) {
                res.status(404).send('Book not found');
            } else {
                res.status(204).send();
            }
        }
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
