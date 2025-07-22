const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jsonSpaces = 4;
const promiseTimeoutDuration = 6000;

const stripSpaces = (string) => {
  return string.replaceAll(" ", "").replaceAll("+", "");
}

public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

function stringifyAndResolve(data) {
  return new Promise((resolve, reject) => {
    try {
      const jsonString = JSON.stringify(data, null, jsonSpaces);
      resolve(jsonString);
    } catch (error) {
      reject(error);
    }
  });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  stringifyAndResolve(books)
    .then(jsonResult => {
      return res.status(200).json(jsonResult);
    })
    .catch(error => {
      console.error("Error stringifying data:", error);
      return res.status(404).json("Error stringifying books");
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const isbnPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: `ISBN ${isbn} not found` });
    }
  });

  isbnPromise.then(result => res.send(result),
    error => res.status(error.status).json({ message: error.message })
  );
});

function getBooksByAuthor(author) {
  return new Promise((resolve) => {
    let result = [];

    console.log('Querying Author: ' + author);
    for (const book in books) {
      // Lowercase comparison
      if (stripSpaces(books[book].author.toLowerCase()) == author) {
        result.push(JSON.stringify(books[book]));
      }
    }
    resolve(result);
  });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = stripSpaces(req.params.author.toLowerCase());

  console.log("Querying author: " + author);
  getBooksByAuthor(author).then(
    result => res.send(JSON.stringify(result, null, jsonSpaces)),
    error => res.status(error.status).json({ message: error.message })
  );
});

function getBooksByTitle(title) {
  return new Promise((resolve) => {
    let result = [];

    for (const book in books) {
      // Lowercase comparison
      if (stripSpaces(books[book].title.toLowerCase()) == title) {
        result.push(JSON.stringify(books[book]));
      }
    }
    resolve(result);
  });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here

  // lowercase comparison
  const title = stripSpaces(req.params.title.toLowerCase());
  getBooksByTitle(title).then(
    result => res.send(JSON.stringify(result, null, jsonSpaces)),
    error => res.status(error.status).json({ message: error.message })
  );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  }
  else {
    return res.status(404).json({ message: "No book with this provided ISBN" });
  }
});

module.exports.general = public_users;
