const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid

  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.

  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    console.log(`Logged in as: ${req.session.authorization.username}`)
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  if (isbn && books[isbn]) {  // Check if isbn exists
    const review = req.body.review;
    const username = req.session.authorization.username;

    if (review) {
      books[isbn].reviews[username] = review;
      res.send(`Review for ISBN:[${isbn}] updated, under username: ${username}.`);
    }
    else {
      res.send("No review provided.");
    }
  }
  else {
    // Respond if friend with specified ISBN is not found
    res.send("Unable to find book with ISBN.");
  }
});

// DELETE request: Delete a revuew by isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Update the code here
  const isbn = req.params.isbn;

  if (isbn && books[isbn]) {  // Check if isbn exists
    const username = req.session.authorization.username;

    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      // Send response confirming deletion of review
      res.send(`Review for ISBN:${isbn} deleted.`);
    }
    else {
      res.send(`No review for ISBN:${isbn} under ${username}.`);
    }
  }
  else {
    // Respond if friend with specified ISBN is not found
    res.send("Unable to find book with ISBN.");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
