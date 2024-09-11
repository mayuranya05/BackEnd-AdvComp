//
//
//
//

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Database connection
mongoose.connect(
    "mongodb://admin:GOTgyb91476@node65882-mayuranya.proen.app.ruk-com.cloud:11567",
    {
        useNewUrlparser: true,
        useUnifiedTopology: true,
    }
);

const Book = mongoose.model("Book", {
    id: {
        type: Number,
        unique: true, //
        required: true, //
    },
    title: String,
    author: String,
});

const app = express();
app.use(bodyParser.json());

// Create
app.post("/books", async (req, res) => {
    try {
        // Get the last book record to determine the next ID
        const lastBook = await Book.findOne().sort({ id: -1 });
        const nextId = lastBook ? lastBook.id +1 : 1;
        
        // Create a new book with the next ID
        const book = new Book({
            id: nextId, // Set the custom "id" field
            ...req.body, // 
        });

        await book.save();
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});
// Read all
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.send(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read one
app.get("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOne({id:req.params.id});
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update
app.put("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate({id:req.params.id}, req.body, {
            new: true,
        });
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete
app.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate({id:req.params.id});
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});