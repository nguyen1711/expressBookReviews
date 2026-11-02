const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get all books using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).send(JSON.stringify(response.data || books, null, 4));
  } catch (error) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    let matchingBooks = [];
    Object.keys(books).forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    });
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 13: Get book details based on title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    let matchingBooks = [];
    Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    });
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
