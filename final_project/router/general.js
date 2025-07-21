const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jsonSpaces = 4;


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.status(200).json(JSON.stringify(books, null, jsonSpaces));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});

  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  // lowercase comparison
  const author = req.params.author.toLowerCase();
  let result = [];

  console.log('Querying Author: ' + author);
  for (const book in books) {
    // Lowercase comparison
    if (books[book].author.toLowerCase() == author) {
      result.push(JSON.stringify(books[book]));
    }
  }

  return res.send(JSON.stringify(result, null, jsonSpaces));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  // lowercase comparison
  const title = req.params.title.toLowerCase();
  let result = [];

  console.log('Querying Title: ' + title);
  for (const book in books) {
    // Lowercase comparison
    if (books[book].title.toLowerCase() == title) {
      result.push(JSON.stringify(books[book]));
    }
  }

  return res.send(JSON.stringify(result, null, jsonSpaces));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
