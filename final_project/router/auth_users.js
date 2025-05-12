const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Code from PracticeProject - index - const doesExist
const isValid = (username)=>{ //returns boolean
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

// Code from PracticeProject - index - Login endpoint
// Only registered users can login
regd_users.post("/login", (req,res) => {
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
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 const isbn = req.params.isbn;
 let filtered_book = books[isbn];
 let review = req.query.review;
 let reviewer = req.session.authorization['username'];
    if(review){
        filtered_book['reviews'][reviewer] = review;
        books[isbn] = filtered_book;
        res.send(`The review for the with ISBN ${isbn} has been added/updated.`);
 }else{
    res.send ("Unable to find this ISBN!");
 }
});

//Deete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
 const isbn = req.params.isbn;
 let reviewer = req.session.authorization['username'];
 let filtered_review = books[isbn]['reviews'];
    if(filtered_review[reviewer]){
        // Delete review with isbn based on reviewer
        delete filtered_review[reviewer];
        res.send(`The review for ISBN ${isbn} post by user ${reviewer} has been deleted.`);
    }else {
        res.send("Can't delete, as this review has been posted by a differnet user")
 }});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
