const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

public_users.post("/register", (req,res) => {
  try {
    const {username, password} = req.body;

    if(!username || !password) {
      return res.status(400).json({message: "Missing username and/or password"})
    }
    else if(!isValid(username)) {
      return res.status(400).json({message: "Invalid username"})
    }
    else {
      let user = {username, password}

      users.push(user);

      return res.status(200).send("User registered successfully")
    }
  }
  catch (e) {
    return res.status(e.status);
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try {
      const book = books[req.params.isbn];

      if(book) {
        return res.status(200).json(book);
      }
      else {
        return res.status(404).json({message: "Error book not found"})
      }
    }
    catch (e) {
      return res.status(e.status);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    const author = req.params.author;

    let filtered_book = Object.values(books).filter((book) => book.author === author);

    if(!filtered_book)
      return res.status(404).json({message: "Error no book with that author"})
    return res.status(200).json(filtered_book);
  }
  catch (e) {
    return res.status(e.status);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
    const title = req.params.title;

    let filtered_book = Object.values(books).filter((book) => book.title === title);

    if(!filtered_book)
      return res.status(404).json({message: "Error no book with that title"})
    return res.status(200).json(filtered_book);
  }
  catch (e) {
    return res.status(e.status);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    const book = books[req.params.isbn];

    if(book) {
      return res.status(200).json(book.reviews);
    }
    else {
      return res.status(404).json({message: "Error book not found"})
    }
  }
  catch (e) {
    return res.status(e.status);
  }
});

module.exports.general = public_users;
