const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Please provide a username and password" });
    }

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    try {
        const fetchedBooks = await new Promise((resolve, reject) => {
            resolve(books)
        })
        res.send(JSON.stringify(fetchedBooks, null, 4));
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    try {
        const isbn = req.params.isbn;
        const book = await new Promise((resolve) => {
            resolve(books[isbn]);
        })

        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ error: 'Internal server error' });

    }

});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    const authorName = req.params.author;
    try {
        const fetchedBooks = await new Promise((resolve, reject) => {
            resolve(books)
        })

        if (fetchedBooks) {
            const booksArray = Object.values(fetchedBooks);
            const filteredBooks = booksArray.filter(book => book.author === authorName)
            return res.send(filteredBooks);
        } else {
            return res.status(404).json({ error: 'Author not found' });
        }
    } catch (error) {
        console.error("Error fetching or filtering books:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    const title = req.params.title;
    try {
        const fetchedBooks = await new Promise((resolve, reject) => {
            resolve(books)
        })
        if (fetchedBooks) {
            const booksArray = Object.values(fetchedBooks);
            const filteredBooks = booksArray.filter(book => book.title === title)
            return res.send(filteredBooks);
        } else {
            return res.status(404).json({ error: 'Title not found' });
        }
    } catch (error) {
        console.error("Error fetching or filtering books:", error);
        res.status(500).send("Internal Server Error");
    }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    return res.send(books[isbn]['reviews']);
});

module.exports.general = public_users;
