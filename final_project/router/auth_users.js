const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const key = "secretest-strongest-key";
let users = [];

const isValid = (username)=>{ //returns boolean

  const invalid = users.some(user => user.username === username);

  if(invalid)
    return false;
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean

  const authenticated = users.some(user => user.username === username && user.password === password);

  if(authenticated)
    return true;
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  try {
    const {username, password} = req.body;

    if(authenticatedUser(username, password)) {
      const token = jwt.sign({username}, key, {expiresIn: 60*60});
      return res.status(200).json({message: 'Logged in', token});
    }
    else {
      return res.status(404).json({message: "Bad credentials"});
    }
  }
  catch (e) {
    return res.status(e.status);
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const token = req.headers['authorization'];

    if(!token)
      return res.status(400).json({message: 'Invalid / missing login token'});

    const isbn = req.params.isbn;
    const review = req.body;
    const verification = jwt.verify(token, key);
    const username = verification.username;

    if(!books[isbn])
      return res.status(404).json({message: "Invalid book isbn"});
    else if(!review)
      return res.status(404).json({message: "Missing review"});
    
    if(!books[isbn])
      books[isbn].reviews = {};
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: 'Succesful review made' }); 
  }
  catch (e) {
    return res.status(e.status);
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const token = req.headers['authorization'];

    if(!token)
      return res.status(400).json({message: 'Invalid / missing login token'});

    const isbn = req.params.isbn;
    const verification = jwt.verify(token, key);
    const username = verification.username;

    if(!books[isbn])
      return res.status(404).json({message: "Invalid book isbn"});
    else if(!books[isbn].reviews[username]) {
      return res.status(404).json({message: 'Review does not exist'});
    }

    delete books[isbn].reviews[username]
    return res.status(200).json({message: 'Review deleted'});
  }
  catch (e) {
    return res.status(e.status);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
